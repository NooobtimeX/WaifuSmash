"use client";

import { forgotPasswordAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ForgotPasswordForm({
  searchParams,
}: {
  searchParams: Message;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <form className="flex w-full max-w-md flex-col p-8 shadow-lg">
        <h1 className="mb-6 text-center text-3xl font-semibold text-white">
          RESET PASSWORD
        </h1>
        <p className="mb-6 text-center text-sm text-white">
          Already have an account?{" "}
          <a href="/SignIn" className="text-third">
            SIGN IN
          </a>
        </p>
        <div className="flex flex-col space-y-4">
          <div>
            <Label htmlFor="email" className="text-white">
              Email
            </Label>
            <Input
              name="email"
              placeholder="you@example.com"
              required
              className="mt-2 w-full rounded-lg border border-gray-300 p-3 transition duration-200 focus:border-blue-500 focus:ring focus:ring-blue-200"
            />
          </div>
          <SubmitButton
            formAction={forgotPasswordAction}
            className="bg-third hover:bg-third mt-6 w-full rounded-xl py-3 text-primary"
          >
            RESET PASSWORD
          </SubmitButton>
          <FormMessage message={searchParams} />
        </div>
      </form>
    </div>
  );
}
