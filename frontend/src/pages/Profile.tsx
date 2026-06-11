import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../app/store";
import { useEffect, useState } from "react";
import { api } from "../services/api";
import { setUser, logout } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ComSidebar } from "@/components/Sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ThreadCard } from "@/components/ThreadCard";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type Thread = {
  id: number;
  content: string | null;
  image: string | null;
  created_at: string;
  isLiked: boolean;
  likes: unknown[];
  thread: unknown[];
  author: {
    id: number;
    username: string;
    full_name: string;
    photo_profile: string | null;
  };
};

type User = {
  id: number;
  username: string;
  full_name: string;
  email: string;
  photo_profile?: string | null;
  bio?: string | null;
  followierCount: number;
  followingConunt: number;
  threads: Thread[];
};

export const Profile = () => {
  const dispatch = useDispatch<AppDispatch>();
  const token = useSelector((state: RootState) => state.auth.token);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const [profileUser, setProfileUser] = useState<User | null>(null);

  const [form, setForm] = useState({
    username: "",
    full_name: "",
    bio: "",
  });

  const getProfile = async () => {
    try {
      const res = await api.get("/user/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("PROFILE DATA:", res.data.deta);

      setProfileUser(res.data.deta);
      dispatch(setUser(res.data.deta));

      setForm({
        username: res.data.deta.username || "",
        full_name: res.data.deta.full_name || "",
        bio: res.data.deta.bio || "",
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
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

    const res = await api.patch("/user/profile", form, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    dispatch(setUser(res.data.data));

    await getProfile();

    setOpen(false);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };
  return (
    <>
      <SidebarProvider>
        <ComSidebar />

        <main className="min-h-screen flex-1 bg-slate-50">
          <div className="sticky top-0 z-10 flex items-center gap-4 border-b bg-white/80 px-6 py-4 backdrop-blur">
            <h1 className="text-2xl font-bold">
              {profileUser ? `@${profileUser.username}` : "Profile"}
            </h1>
          </div>

          <div className="mx-auto max-w-2xl p-6">
            {profileUser ? (
              <Card className="overflow-hidden">
                <div className="h-32" />

                <CardContent className="relative p-6">
                  <Avatar className="-mt-16 h-28 w-28 border-4 border-white">
                    <AvatarImage src={profileUser.photo_profile ?? ""} />
                    <AvatarFallback className="text-3xl font-bold">
                      {profileUser.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div className="mt-4 flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-bold">
                        {profileUser.full_name}
                      </h2>
                      <p className="text-muted-foreground">
                        @{profileUser.username}
                      </p>
                    </div>

                    <Dialog open={open} onOpenChange={setOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline">Edit Profile</Button>
                      </DialogTrigger>

                      <DialogContent className="sm:max-w-sm">
                        <form onSubmit={handleSubmit} className="space-y-5">
                          <DialogHeader>
                            <DialogTitle>Edit profile</DialogTitle>
                            <DialogDescription>
                              Ubah profile kamu di sini.
                            </DialogDescription>
                          </DialogHeader>

                          <FieldGroup>
                            <Field>
                              <Label htmlFor="username">Username</Label>
                              <Input
                                id="username"
                                name="username"
                                value={form.username}
                                onChange={handleChange}
                              />
                            </Field>

                            <Field>
                              <Label htmlFor="full_name">Full Name</Label>
                              <Input
                                id="full_name"
                                name="full_name"
                                value={form.full_name}
                                onChange={handleChange}
                              />
                            </Field>

                            <Field>
                              <Label htmlFor="bio">Bio</Label>
                              <Textarea
                                id="bio"
                                name="bio"
                                value={form.bio}
                                onChange={handleChange}
                              />
                            </Field>
                          </FieldGroup>

                          <DialogFooter>
                            <DialogClose asChild>
                              <Button type="button" variant="outline">
                                Cancel
                              </Button>
                            </DialogClose>

                            <Button type="submit">Save changes</Button>
                          </DialogFooter>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>

                  <p className="mt-4 text-sm text-slate-700">
                    {profileUser.bio || "-"}
                  </p>

                  <Separator className="my-6" />

                  <div className="grid grid-cols-3 text-center">
                    <div>
                      <p className="text-xl font-bold">
                        {profileUser.threads.length}
                      </p>
                      <p className="text-sm text-muted-foreground">Threads</p>
                    </div>

                    <div
                      onClick={() => navigate("/follow-list?tab=follower")}
                      className="cursor-pointer"
                    >
                      <p className="text-xl font-bold">
                        {profileUser.followierCount ?? 0}
                      </p>
                      <p className="text-sm text-muted-foreground">Following</p>
                    </div>

                    <div
                      onClick={() => navigate("/follow-list?tab=following")}
                      className="cursor-pointer"
                    >
                      <p className="text-xl font-bold">
                        {profileUser.followingConunt ?? 0}
                      </p>
                      <p className="text-sm text-muted-foreground">Follower</p>
                    </div>

                  </div>

                  <Separator className="my-6" />

                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{profileUser.email}</p>
                  </div>

                  <div className="mt-6 space-y-4">
                    <h2 className="text-xl font-bold">My Threads</h2>

                    {profileUser.threads.length > 0 ? (
                      profileUser.threads.map((thread) => (
                        <ThreadCard
                          key={thread.id}
                          id={thread.id}
                          content={thread.content ?? ""}
                          image={thread.image}
                          createdAt={thread.created_at}
                          author={thread.author}
                          likesCount={thread.likes.length}
                          commentsCount={thread.thread.length}
                          isLiked={thread.isLiked}
                          token={token}
                        />
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        Belum ada thread.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <p>Loading...</p>
            )}
          </div>
        </main>
      </SidebarProvider>
    </>
  );
};
