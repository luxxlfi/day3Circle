import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { RootState } from "../app/store";
import { api } from "@/services/api";

export const CreateThread = () => {
  const navigate = useNavigate();
  const token = useSelector((state: RootState) => state.auth.token);

  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleCreateThread = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim() && !image) {
      alert("Postingan tidak boleh kosong");
      return;
    }

    const formData = new FormData();
    formData.append("content", content);

    if (image) {
      formData.append("image", image);
    }

    await api.post("/thread/posting", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setContent("");
    setImage(null);
    setPreview(null);

    navigate("/home");
  };

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-6 text-2xl font-bold">Create Thread</h1>

        <form
          onSubmit={handleCreateThread}
          className="rounded-xl border bg-white p-4 shadow-sm"
        >
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Apa yang kamu pikirkan?"
            className="min-h-32 w-full resize-none rounded-lg border p-3 outline-none"
          />

          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="mt-4 max-h-[350px] w-full rounded-xl object-cover"
            />
          )}

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="mt-4"
          />

          <div className="mt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate("/home")}
              className="rounded-lg border px-4 py-2"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-lg bg-slate-900 px-4 py-2 text-white"
            >
              Post
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};
