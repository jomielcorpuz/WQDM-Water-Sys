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
import { Head, Link, useForm } from "@inertiajs/react";
import { Checkbox } from "@/Components/ui/checkbox";

export default function Login({ className, status, canResetPassword, ...props }) {
  const { data, setData, post, processing, errors, reset } = useForm({
    email: "",
    password: "",
    remember: false,
  });

  const submit = (e) => {
    e.preventDefault();
    post(route("login"), {
      onFinish: () => reset("password"),
    });
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className={cn("flex flex-col gap-6", className)} {...props}>
          <Head title="Log in" />
          <Card>
            <CardHeader>
              <div className="flex justify-center py-4">
                <CardTitle className="text-3xl text-gray-800">Welcome back</CardTitle>
              </div>
              <CardDescription>
                Enter your email below to login to your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              {status && (
                <div className="mb-4 text-sm font-medium text-green-600">{status}</div>
              )}
              <form onSubmit={submit} className="flex flex-col gap-6">
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
                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    {canResetPassword && (
                      <Link
                        href={route("password.request")}
                        className="text-sm underline-offset-4 hover:underline"
                      >
                        Forgot your password?
                      </Link>
                    )}
                  </div>
                  <Input
                    id="password"
                    type="password"
                    value={data.password}
                    onChange={(e) => setData("password", e.target.value)}
                    required
                  />
                  {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={data.remember}
                    onCheckedChange={(checked) => setData("remember", checked)}
                  />
                  <label
                    htmlFor="remember"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Remember me
                  </label>
                </div>
                <Button type="submit" className="w-full" disabled={processing}>
                  Login
                </Button>

              </form>
              <div className="mt-4 text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link href={route("register")} className="underline underline-offset-4">
                  Sign up
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

    </div>
  );
}
