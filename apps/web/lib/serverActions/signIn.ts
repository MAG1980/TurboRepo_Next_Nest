import { FormState } from '@/lib/types';
import { SigninFormSchema } from '@/lib/schemas';

export const signIn = async (
  state: FormState,
  formData: FormData
): Promise<FormState> => {
  const validatedFields = SigninFormSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors,
    };
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/signin`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(validatedFields.data),
    }
  );

  if (response.ok) {
    const result = response.json();
    //TODO: Create the session for authenticated user
    console.log({ result });
  } else {
    return {
      message:
        response.status === 401 ? 'Invalid credentials!' : response.statusText,
    };
  }
};
