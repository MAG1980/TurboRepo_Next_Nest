import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submitButton";

export const SignupForm = () => {
  return (
    <form className="flex flex-col gap-2">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input id="name" type="text" name="name" placeholder="username"/>
      </div>

      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" name="email" placeholder="username@email.com"/>
      </div>

      <div>
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" name="password" placeholder="Password"/>
      </div>

      <SubmitButton>Sgn Up</SubmitButton>
    </form>
  );
};