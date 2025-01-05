import { FormState } from '@/lib/types';
import { SigninFormSchema } from '@/lib/schemas';
import { createSession } from "@/lib/session";
import { redirect } from "next/navigation";

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
    const result = await response.json();

    await createSession({
      user: {
        id: result.id,
        name: result.name
      }
    })
    redirect('/')
  } else {
    return {
      message:
        response.status === 401 ? 'Invalid credentials!' : response.statusText,
    };
  }
};
