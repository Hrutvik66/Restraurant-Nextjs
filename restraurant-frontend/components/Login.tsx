"use client";

// React
import React, { useState } from "react";
// Next
import { useRouter, useParams } from "next/navigation";
// shad-cn ui component
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
// lucide icon
import { AlertCircle } from "lucide-react";
// context hook
import useApiCall from "@/hooks/use-apicall";
import { toast } from "@/hooks/use-toast";
// js cookie
import Cookies from "js-cookie";
// Custom Error interface
import CustomErrorInterface from "../lib/CustomErrorInterface";
import { useAuthContext } from "@/context/auth-context";

const LoginPage = ({ role }: { role: string }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPasswordDialog, setShowForgotPasswordDialog] =
    useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const router = useRouter();
  const { makeRequest } = useApiCall();
  const { slug } = useParams();
  const { login } = useAuthContext();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const response = await makeRequest({
        url: "/api/owner/login",
        method: "POST",
        data: {
          email,
          password,
        },
        params: {
          slug,
        },
      });
      console.log("response", response);

      if (response && response.status === 200) {
        Cookies.set("token", response.data.token, { expires: 7 });
        login(response.data.user);
        toast({
          variant: "default",
          title: "Login Successful",
          description: response.data.message,
        });
        router.push(`/${slug}/owner/analytics`);
      }
    } catch (err) {
      const error = err as CustomErrorInterface;
      toast({
        variant: "destructive",
        title: "Login Error",
        description: error.response.data.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      alert(`Password reset link sent to ${forgotPasswordEmail}`);
      setShowForgotPasswordDialog(false);
    } catch (err) {
      setError("Failed to send password reset email");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center bg-gray-100">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>{role} Login</CardTitle>
          <CardDescription>
            Enter your email and password to access the {role.toLowerCase()}{" "}
            panel.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            {error && (
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button className="w-full mt-4" type="submit" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Dialog
            open={showForgotPasswordDialog}
            onOpenChange={setShowForgotPasswordDialog}
          >
            <DialogTrigger asChild>
              <Button variant="link">Forgot password?</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Forgot Password</DialogTitle>
                <DialogDescription>
                  Enter your email address and we&apos;ll send you a link to
                  reset your password.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleForgotPassword}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label
                      htmlFor="forgot-password-email"
                      className="text-right"
                    >
                      Email
                    </Label>
                    <Input
                      id="forgot-password-email"
                      type="email"
                      className="col-span-3"
                      value={forgotPasswordEmail}
                      onChange={(e) => setForgotPasswordEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Sending..." : "Send Reset Link"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginPage;
