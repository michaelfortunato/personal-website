import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import Link from "next/link";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { forwardRef } from "react";

type SignInFormProps = {
  preview?: boolean;
  children?: React.ReactNode;
};
export function SignInForm(props: SignInFormProps) {
  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              required
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
              <Link href="#" className="ml-auto inline-block text-sm underline">
                Forgot your password?
              </Link>
            </div>
            <Input id="password" type="password" required />
          </div>
          <Button type="submit" className="w-full">
            Login
          </Button>
          <Button variant="outline" className="w-full">
            Login with GitHub
          </Button>
        </div>
        <div className="mt-4 text-center text-sm">
          {"Don't have an account? "}
          <Link href="#" className="underline">
            Sign up
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

type SignInFormDialogProps = {} & SignInFormProps;

const SignInFormDialog = forwardRef<HTMLDivElement, SignInFormDialogProps>(
  (props, ref) => (
    <div ref={ref}>
      {/* Spread props properly */}
      <SignInForm {...props} />
    </div>
  ),
);

// Add a displayName for better debugging
SignInFormDialog.displayName = "SignInFormDialog";

type SignInButtonProps = {
  preview?: boolean;
  children?: React.ReactNode;
};
export function SignInButton(props: SignInButtonProps) {
  return (
    <Dialog>
      <DialogTrigger>
        <Button asChild>
          <div>Sign In</div>
        </Button>
      </DialogTrigger>
      <DialogContent className="w-auto rounded border-none p-0 shadow-lg">
        <SignInForm />
      </DialogContent>
    </Dialog>
  );
}
