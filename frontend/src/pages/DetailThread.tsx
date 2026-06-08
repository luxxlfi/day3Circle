import type { RootState } from "@/app/store";
import { ComSidebar } from "@/components/Sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { api } from "@/services/api";
import { Heart, MessageCircle } from "lucide-react";
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

    await api.post(
      `/thread/${threadId}/reply`,
      {
        content: replyContent,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    setReplyContent("");
    GetThread();
  };

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
                <form onSubmit={handleCreateReply} className="flex gap-2">
                  <input
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="Tulis reply..."
                    className="flex-1 rounded-md border px-3 py-2 text-sm"
                  />

                  <button
                    type="submit"
                    className="rounded-md bg-slate-900 px-4 py-2 text-sm text-white"
                  >
                    Kirim
                  </button>
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
