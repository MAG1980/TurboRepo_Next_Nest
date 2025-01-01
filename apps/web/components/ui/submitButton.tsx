"use client"
import { PropsWithChildren } from "react";
import { useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button";

export const SubmitButton = ({ children }: PropsWithChildren) => {
  const { pending } = useFormStatus()
  return (
    <Button
      type="submit"
      disabled={pending}
      className="w-full mt-2"
    >
      {pending ? "Submitting..." : children}
    </Button>
  );
};
