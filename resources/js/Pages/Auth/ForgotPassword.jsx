import { Head, useForm } from '@inertiajs/react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ForgotPassword({ className, status, ...props }) {
  const { data, setData, post, processing, errors } = useForm({
    email: '',
  });

  const submit = (e) => {
    e.preventDefault();

    post(route('password.email'));
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className={cn("flex flex-col gap-6", className)} {...props}>
          <Head title="Forgot Password" />
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Forgot Password</CardTitle>
              <CardDescription>
                Forgot your password? No problem. Just enter your email, and we'll send you a reset link.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {status && (
                <div className="mb-4 text-sm font-medium text-green-600 dark:text-green-400">
                  {status}
                </div>
              )}
              <form onSubmit={submit} className="flex flex-col gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    value={data.email}
                    onChange={(e) => setData("email", e.target.value)}
                    required
                  />
                  {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                </div>
                <Button type="submit" className="w-full" disabled={processing}>
                  Email Password Reset Link
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
