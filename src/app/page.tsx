"use client";

import { useState } from "react";
import type { FormData } from "@/types/form";
import { Header } from "@/components/Header";
import { GenerateForm } from "@/components/GenerateForm";
import { ResultPanel } from "@/components/ResultPanel";

export default function Home() {
  const [posts, setPosts] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async (data: FormData) => {
    setLoading(true);
    setError("");
    setPosts([]);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        setError(result.error);
        return;
      }

      setPosts(result.posts);
    } catch {
      setError("네트워크 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50/50 to-orange-50/30">
      <Header />

      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-slate-900 mb-3">
            AI로 커뮤니티 바이럴 글을 자동 생성하세요
          </h2>
          <p className="text-slate-500 text-lg">
            타겟 정보와 제품 정보를 입력하면, 자연스러운 바이럴 글을
            만들어드립니다.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          <GenerateForm loading={loading} onGenerate={handleGenerate} />
          <ResultPanel posts={posts} loading={loading} error={error} />
        </div>
      </main>
    </div>
  );
}
