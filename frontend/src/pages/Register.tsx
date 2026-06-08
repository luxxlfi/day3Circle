import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/services/api";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";

export const Register = () => {
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    full_name: "",
    email: "",
    password: "",
  });

  const hendleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await api.post("/auth/register", form);

      console.log(res.data);

      navigate("/login");

      console.log(form);
    } catch (err: any) {
      setError(err.response.data.message);
      setTimeout(() => {
        setError("");
      }, 5000);
    }
  };

  return (
    <>
      {error && (
        <Alert
          variant="destructive"
          className="fixed top-5 left-1/2 -translate-x-1/2 z-50 w-96 shadow-lg"
        >
          <AlertCircleIcon />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="relative min-h-screen w-screen flex items-center justify-center">
        <div
          className="absolute inset-0 -z-10 h-full w-full bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,_#000_30%,_transparent_70%)]"
          style={{
            backgroundColor: "#f9fafb",
            backgroundImage: `
      linear-gradient(to right, #d1d5db 1px, transparent 1px),
      linear-gradient(to bottom, #d1d5db 1px, transparent 1px)
    `,
          }}
        />

        <Card className="w-full max-w-sm shadow-lg">
          <CardHeader>
            <CardTitle>Create your account</CardTitle>
            <CardDescription>
              Enter your email, username, amd password to create your account
            </CardDescription>
            <CardAction>
              <Button variant="link" onClick={() => navigate("/Login")}>
                Login
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="user_name">username</Label>
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    placeholder="username"
                    value={form.username}
                    onChange={hendleChange}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="m@example.com"
                    value={form.email}
                    onChange={hendleChange}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                  </div>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={hendleChange}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  sign up
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
};
