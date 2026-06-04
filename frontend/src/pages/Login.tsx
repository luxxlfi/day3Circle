import { useState } from "react";
import { api } from "../services/api";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../app/store";
import { loginSuccess } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Login = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [email, setEmail] = useState("");
  const [password, setPasword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await api.post("/auth/login", {
        email: email,
        password: password,
      });

      dispatch(
        loginSuccess({
          token: res.data.token,
          user: null,
        }),
      );
      navigate("/profile");
      console.log("login nih", res.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    // <div className="max-w-sm mx-auto">
    //   <h1>LOGIN</h1>

    //   <input
    //     type="email"
    //     placeholder="xxxxx@gmail.com"
    //     value={email}
    //     onChange={(e) => setEmail(e.target.value)}
    //   />
    //   <input
    //     type="password"
    //     placeholder="password"
    //     value={password}
    //     onChange={(e) => setPasword(e.target.value)}
    //   />

    //   <button onClick={handleLogin}>Login</button>
    // </div>
    <>
      <div className="relative min-h-screen w-screen flex items-center justify-center overflow-hidden bg-[#f8fafc]">
        <div
          className="absolute inset-0 z-0 h-full w-full bg-[size:20px_30px]"
          style={{
            backgroundColor: "#f8fafc",
            backgroundImage: `
      linear-gradient(to right, #e2e8f0 1px, transparent 1px),
      linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)
    `,
            maskImage:
              "radial-gradient(ellipse 70% 60% at 50% 50%, #000 60%, transparent 100%)",
          }}
        />

        <Card className="relative z-10 w-full max-w-sm shadow-lg bg-white">
          <CardHeader>
            <CardTitle>Login to your account</CardTitle>
            <CardDescription>
              Enter your email below to login to your account
            </CardDescription>
            <CardAction>
              <Button variant="link" onClick={() => navigate("/Register")}>
                Sign Up
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            <form>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <a
                      href="#"
                      className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                    >
                      Forgot your password?
                    </a>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPasword(e.target.value)}
                    required
                  />
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <Button type="submit" className="w-full" onClick={handleLogin}>
              Login
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
};
