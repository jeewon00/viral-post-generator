"use client";

import { useForm, Controller } from "react-hook-form";
import type { FormData } from "@/types/form";
import {
  AGE_RANGES,
  GENDERS,
  JOBS,
  INTERESTS,
  SPENDING_TYPES,
  CATEGORIES,
  VIRAL_STYLES,
  TONES,
  CTA_OPTIONS,
} from "@/constants/form-options";
import { RadioGroup } from "@/components/ui/RadioGroup";
import { CheckboxGroup } from "@/components/ui/CheckboxGroup";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Spinner } from "@/components/ui/Spinner";

interface GenerateFormProps {
  loading: boolean;
  onGenerate: (data: FormData) => void;
}

export function GenerateForm({ loading, onGenerate }: GenerateFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      target: {
        ageRange: "",
        gender: "",
        job: "",
        interests: ["연애"],
        painPoint: "",
        spendingType: "",
      },
      product: {
        category: "",
        productName: "",
        keyBenefit: "",
        differentiator: "",
      },
      content: {
        viralStyle: "질문형 (궁금해서 써봄)",
        tone: "반말 (친근한)",
        cta: "",
      },
      additionalInfo: "",
      useTrending: true,
    },
  });

  return (
    <form
      onSubmit={handleSubmit(onGenerate)}
      className="lg:col-span-2 space-y-5"
    >
      {/* 섹션 1: 타겟 정보 */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4">
        <SectionHeader
          number={1}
          title="타겟 정보"
          subtitle="바이럴로 유입하고 싶은 대상"
        />
        <Controller
          name="target.ageRange"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <RadioGroup
              label="연령대"
              options={AGE_RANGES}
              value={field.value}
              onChange={field.onChange}
              required
              error={!!errors.target?.ageRange}
            />
          )}
        />
        <Controller
          name="target.gender"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <RadioGroup
              label="성별"
              options={GENDERS}
              value={field.value}
              onChange={field.onChange}
              required
              error={!!errors.target?.gender}
            />
          )}
        />
        <Controller
          name="target.job"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <RadioGroup
              label="직업/라이프스타일"
              options={JOBS}
              value={field.value}
              onChange={field.onChange}
              required
              error={!!errors.target?.job}
            />
          )}
        />
        <Controller
          name="target.interests"
          control={control}
          rules={{ validate: (v) => v.length > 0 }}
          render={({ field }) => (
            <CheckboxGroup
              label="관심 분야"
              options={INTERESTS}
              values={field.value}
              onChange={field.onChange}
              required
              error={!!errors.target?.interests}
            />
          )}
        />
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            핵심 페인포인트
          </label>
          <input
            type="text"
            {...register("target.painPoint")}
            placeholder="예: 퇴근 후 피부가 푸석해지고 피로가 쌓이는 것"
            className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition text-sm"
          />
        </div>
        <Controller
          name="target.spendingType"
          control={control}
          render={({ field }) => (
            <RadioGroup
              label="소비 성향"
              options={SPENDING_TYPES}
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
      </div>

      {/* 섹션 2: 콘텐츠 방향 */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4">
        <SectionHeader
          number={2}
          title="콘텐츠 방향"
          subtitle="글의 스타일과 톤 설정"
        />
        <Controller
          name="content.viralStyle"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <RadioGroup
              label="바이럴 방식"
              options={VIRAL_STYLES}
              value={field.value}
              onChange={field.onChange}
              required
              error={!!errors.content?.viralStyle}
            />
          )}
        />
        <Controller
          name="content.tone"
          control={control}
          render={({ field }) => (
            <RadioGroup
              label="브랜드 톤"
              options={TONES}
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
        <Controller
          name="content.cta"
          control={control}
          render={({ field }) => (
            <RadioGroup
              label="CTA (행동 유도)"
              options={CTA_OPTIONS}
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="useTrending"
            {...register("useTrending")}
            className="w-4 h-4 rounded border-slate-300 text-cyan-500 focus:ring-cyan-500 cursor-pointer"
          />
          <label
            htmlFor="useTrending"
            className="text-sm font-semibold text-slate-700 cursor-pointer select-none"
          >
            실시간 트렌드/밈 적용
            <span className="ml-1.5 text-xs font-normal text-slate-400">
              Google Trends 기반 최신 키워드 반영
            </span>
          </label>
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            추가 요청사항
          </label>
          <textarea
            {...register("additionalInfo")}
            placeholder="예: 이모지 적절히 포함 / 경쟁사 직접 언급 금지 / 해시태그 5개 포함"
            rows={3}
            className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition resize-none text-sm"
          />
        </div>
      </div>

      {/* 섹션 3: 제품/서비스 정보 */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4">
        <SectionHeader
          number={3}
          title="제품/서비스 정보"
          subtitle="홍보할 제품의 상세 정보"
        />
        <Controller
          name="product.category"
          control={control}
          render={({ field }) => (
            <RadioGroup
              label="카테고리"
              options={CATEGORIES}
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            제품/서비스명
          </label>
          <input
            type="text"
            {...register("product.productName")}
            placeholder="예: 비타민C 고함량 영양제 '비타플러스'"
            className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            핵심 혜택
          </label>
          <input
            type="text"
            {...register("product.keyBenefit")}
            placeholder="예: 하루 한 알로 피로 회복과 피부 개선을 동시에"
            className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            경쟁 제품 대비 차별점
          </label>
          <input
            type="text"
            {...register("product.differentiator")}
            placeholder="예: 국내산 원료, 흡수율 3배 높은 리포좀 방식"
            className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition text-sm"
          />
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-2xl hover:from-cyan-600 hover:to-blue-700 disabled:from-slate-300 disabled:to-slate-300 disabled:cursor-not-allowed transition flex items-center justify-center gap-2 shadow-sm cursor-pointer"
      >
        {loading ? (
          <>
            <Spinner />
            글 생성 중...
          </>
        ) : (
          "바이럴 글 생성하기"
        )}
      </button>
    </form>
  );
}
