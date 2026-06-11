import type { RootState } from "@/app/store";
import { ComSidebar } from "@/components/Sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { SidebarProvider } from "@/components/ui/sidebar";
import { socket } from "@/lib/socket";
import { api } from "@/services/api";
import { Heart, ImageIcon, MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

type Thread = {
  id: number;
  content: string | null;
  image: string | null;
  created_at: string;
  isLiked: boolean;
  likes: { user_id: number }[];
  thread: Reply[];
  author: User;
};

type Reply = {
  id: number;
  content: string;
  image: string | null;
  Users: User;
};

type User = {
  id: number;
  username: string;
  full_name: string | null;
  photo_profile: string | null;
};

export const DetailThread = () => {
  const [liked, setLiked] = useState(false);
  const [likeTotal, setLikeTotal] = useState(0);
  const IMAGE_URL = "http://localhost:2323";
  const [thread, setThread] = useState<Thread | null>(null);

  const { threadId } = useParams();

  const token = useSelector((state: RootState) => state.auth.token);
  const user = useSelector((state: RootState) => state.auth.user);
  const [replyContent, setReplyContent] = useState("");
  const [replyImage, setReplyImage] = useState<File | null>(null);

  const GetThread = async () => {
    const res = await api.get(`/thread/${threadId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = res.data.data;

    setThread(data);
    setLikeTotal(data.likes.length);
    setLiked(data.likes);
  };
  // like
  const handleLike = async () => {
    const res = await api.post(
      `/thread/${threadId}/like`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    setLiked(res.data.liked);
    setLikeTotal((prev) => (res.data.liked ? prev + 1 : prev - 1));
  };

  const handleCreateReply = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("threadId:", threadId);

    if (!replyContent.trim() && !replyImage) {
      alert("Reply tidak boleh kosong");
      return;
    }

    const formData = new FormData();
    formData.append("content", replyContent);

    if (replyImage) {
      formData.append("image", replyImage);
    }
    try {
      await api.post(`/thread/${threadId}/reply`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      alert("Gagal mengirim reply, coba lagi");
      console.error(error);
    }

    setReplyContent("");
    setReplyImage(null);
  };

  useEffect(() => {
    socket.on("reply:new", (data) => {
      if (Number(data.threadId) !== Number(threadId)) return;

      setThread((prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          thread: [...prev.thread, data.reply],
        };
      });
    });

    return () => {
      socket.off("reply:new");
    };
  }, [threadId]);

  useEffect(() => {
    GetThread();
  }, []);

  return (
    <SidebarProvider>
      <ComSidebar />

      <div className="mx-auto w-full max-w-3xl px-6 py-6">
        {!thread ? (
          <p className="text-center text-muted-foreground">Loading...</p>
        ) : (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={thread.author.photo_profile || ""} />
                  <AvatarFallback>
                    {thread.author.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div>
                  <p className="font-semibold">{thread.author.full_name}</p>
                  <p className="text-sm text-muted-foreground">
                    @{thread.author.username}
                  </p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <p className="text-base">{thread.content}</p>

              {thread.image && (
                <img
                  src={`${IMAGE_URL}${thread.image}`}
                  alt="thread"
                  className="w-full rounded-lg border object-cover"
                />
              )}

              <div className="flex gap-6 text-sm text-muted-foreground">
                <button
                  onClick={handleLike}
                  className={`flex items-center gap-2 transition-colors ${
                    liked ? "text-red-500" : "hover:text-red-500"
                  }`}
                >
                  <Heart size={18} fill={liked ? "currentColor" : "none"} />
                  <span className="text-sm">{likeTotal}</span>
                </button>

                <div className="flex items-center gap-1">
                  <MessageCircle size={18} />
                  <span>{thread.thread.length} Replies</span>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h2 className="font-semibold">Replies</h2>
                <form onSubmit={handleCreateReply} className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      placeholder="Tulis reply..."
                      className="flex-1"
                    />

                    <Button type="submit">Kirim</Button>
                  </div>

                  <label className="flex w-fit cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm text-muted-foreground hover:bg-muted">
                    <ImageIcon size={16} />
                    <span>
                      {replyImage ? replyImage.name : "Tambah gambar"}
                    </span>

                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        setReplyImage(e.target.files?.[0] || null)
                      }
                      className="hidden"
                    />
                  </label>
                </form>

                {thread.thread.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Belum ada reply.
                  </p>
                ) : (
                  thread.thread.map((reply) => (
                    <div key={reply.id} className="flex gap-3">
                      <Avatar>
                        <AvatarImage src={reply.Users.photo_profile || ""} />
                        <AvatarFallback>
                          {reply.Users.username.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 rounded-lg bg-muted p-3">
                        <p className="font-semibold">
                          {reply.Users.full_name || reply.Users.username}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          @{reply.Users.username}
                        </p>

                        <p className="mt-2">{reply.content}</p>

                        {reply.image && (
                          <img
                            src={`${IMAGE_URL}${reply.image}`}
                            alt="reply"
                            className="mt-3 w-full rounded-lg border"
                          />
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </SidebarProvider>
  );
};
