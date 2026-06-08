import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ComSidebar } from "@/components/Sidebar";
import { ThreadCard } from "@/components/ThreadCard";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../app/store";
import { api } from "../services/api";
import { socket } from "@/lib/socket";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

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
export const Home = () => {
  const token = useSelector((state: RootState) => state.auth.token);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [notifT, setNotif] = useState("");

  const getThreads = async () => {
    try {
      const res = await api.get("/thread/home", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setThreads(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getThreads();
  }, []);

  useEffect(() => {
    socket.on("thread:new", (newThread: Thread) => {
      setThreads((prev) => [newThread, ...prev]);
    });

    return () => {
      socket.off("thread:new");
    };
  }, []);

  useEffect(() => {
    socket.on("thread:new", (newThread: Thread) => {
      setThreads((prev) => [newThread, ...prev]);

      setNotif(`${newThread.author.username} baru saja menambahkan postingan`);

      setTimeout(() => {
        setNotif("");
      }, 3000);
    });

    return () => {
      socket.off("thread:new");
    };
  }, []);

  return (
    <>
      {notifT && (
        <Alert className="fixed top-5 left-1/2 -translate-x-1/2 z-50 w-96 shadow-lg">
          <InfoIcon />
          <AlertTitle>New feature available</AlertTitle>
          <AlertDescription>{notifT}</AlertDescription>
        </Alert>
      )}
      <SidebarProvider>
        <ComSidebar />

        <main className="min-h-screen flex-1 bg-slate-50">
          <div className="sticky top-0 z-10 flex items-center gap-4 border-b bg-white/80 px-6 py-4 backdrop-blur">
            <h1 className="text-2xl font-bold">Home</h1>
          </div>

          <div className="mx-auto max-w-2xl space-y-4 p-6">
            {threads.map((thread) => (
              <ThreadCard
                key={thread.id}
                id={thread.id}
                content={thread.content ?? ""}
                createdAt={thread.created_at}
                author={thread.author}
                image={thread.image}
                likesCount={thread.likes.length}
                commentsCount={thread.thread.length}
                isLiked={thread.isLiked}
                token={token}
              />
            ))}
          </div>
        </main>
      </SidebarProvider>
    </>
  );
};
