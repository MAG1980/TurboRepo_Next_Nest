import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export const SignupForm = () => {
  return (
    <form>
      <div className="flex flex-col gap-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" type="text" name="name" placeholder="Name"/>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" name="email" placeholder="Email"/>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" name="password" placeholder="Password"/>
      </div>
    </form>
  );
};