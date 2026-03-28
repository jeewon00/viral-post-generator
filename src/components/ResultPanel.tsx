"use client";

import { useState } from "react";
import { Spinner } from "@/components/ui/Spinner";

interface ResultPanelProps {
  posts: string[];
  loading: boolean;
  error: string;
}

export function ResultPanel({ posts, loading, error }: ResultPanelProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = async (text: string, index: number) => {
    await navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="lg:col-span-3 space-y-5">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-xl">
          {error}
        </div>
      )}

      {posts.length === 0 && !loading && !error && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center sticky top-24">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <p className="text-slate-500 text-lg font-medium">
            왼쪽 폼을 채우고 생성 버튼을 눌러주세요
          </p>
          <p className="text-slate-400 text-sm mt-1">
            AI가 3개의 바이럴 글을 만들어드립니다
          </p>
        </div>
      )}

      {loading && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center sticky top-24">
          <Spinner className="w-10 h-10 text-cyan-500 mx-auto mb-4" />
          <p className="text-slate-600 font-medium text-lg">
            AI가 바이럴 글을 작성하고 있어요...
          </p>
          <p className="text-slate-400 text-sm mt-1">
            약 30~40초 정도 소요됩니다
          </p>
        </div>
      )}

      {posts.map((post, i) => {
        const lines = post.split("\n");
        const title = lines[0];
        const body = lines.slice(1).join("\n").trim();

        return (
          <div
            key={i}
            className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
          >
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100 bg-slate-50">
              <span className="text-sm font-semibold text-slate-500">
                글 #{i + 1}
              </span>
              <button
                onClick={() => handleCopy(post, i)}
                className="text-sm text-cyan-600 hover:text-cyan-800 font-medium flex items-center gap-1 transition cursor-pointer"
              >
                {copiedIndex === i ? (
                  <>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    복사됨!
                  </>
                ) : (
                  <>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                    복사하기
                  </>
                )}
              </button>
            </div>
            <div className="p-5">
              <h3 className="font-bold text-slate-800 text-lg mb-3">
                {title}
              </h3>
              <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                {body}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
