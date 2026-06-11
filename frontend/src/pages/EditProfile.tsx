import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/app/store";
import { api } from "@/services/api";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const EditProfile = () => {
  const token = useSelector((state: RootState) => state.auth.token);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    full_name: "",
    bio: "",
  });

  useEffect(() => {
    const getProfile = async () => {
      const res = await api.get("/user/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setForm({
        username: res.data.deta.username || "",
        full_name: res.data.deta.full_name || "",
        bio: res.data.deta.bio || "",
      });
    };

    if (token) {
      getProfile();
    }
  }, [token]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await api.patch("/user/profile", form, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    navigate("/profile");
  };

  return (
    <Card className="mx-auto mt-10 max-w-xl">
      <CardHeader>
        <CardTitle>Edit Profile</CardTitle>
        <CardDescription>Update informasi profile kamu</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              name="username"
              value={form.username}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="full_name">Full Name</Label>
            <Input
              id="full_name"
              name="full_name"
              value={form.full_name}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              name="bio"
              value={form.bio}
              onChange={handleChange}
            />
          </div>

          <Button
            type="button"
            onClick={() => navigate("/profile")}
            className="w-full bg-red-500 hover:bg-red-700"
          >
            Cancel
          </Button>

          <Button type="submit" className="w-full ">
            Save Changes
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
