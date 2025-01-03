import { FormState } from '@/lib/types';
import { SignupFormSchema } from '@/lib/schemas';
import { redirect } from 'next/navigation';

export const signUp = async (
  state: FormState,
  formData: FormData
): Promise<FormState> => {
  const validationFields = SignupFormSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!validationFields.success) {
    return {
      error: validationFields.error.flatten().fieldErrors,
    };
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/signup`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(validationFields.data),
    }
  );

  if (response.ok) {
    redirect('/auth/signin');
  } else {
    return {
      message:
        response.status === 409 ? 'User already exists' : response.statusText,
    };
  }
};
