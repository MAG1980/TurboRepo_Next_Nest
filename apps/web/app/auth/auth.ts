import { FormState } from "@/lib/types";

export const signUp = async (state: FormState, formData: FormData): Promise<FormState> => {
  console.log(formData)
  return await state
}