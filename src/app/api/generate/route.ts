import { NextRequest, NextResponse } from "next/server";

interface RequestBody {
  target: {
    ageRange: string;
    gender: string;
    job: string;
    interests: string[];
    painPoint: string;
    spendingType: string;
  };
  product: {
    category: string;
    productName: string;
    keyBenefit: string;
    differentiator: string;
  };
  content: {
    viralStyle: string;
    tone: string;
    cta: string;
  };
  additionalInfo: string;
}

export async function POST(req: NextRequest) {
  const body: RequestBody = await req.json();
  const { target, product, content, additionalInfo } = body;

  if (
    !target.ageRange ||
    !target.gender ||
    !target.job ||
    target.interests.length === 0
  ) {
    return NextResponse.json(
      { error: "필수 항목을 모두 입력해주세요." },
      { status: 400 }
    );
  }

  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "API 키가 설정되지 않았습니다." },
      { status: 500 }
    );
  }

  const toneText = content.tone || "반말 (친근한)";

  const systemPrompt = `당신은 한국 온라인 커뮤니티에서 바이럴 마케팅 글을 작성하는 전문 카피라이터입니다.
다음 규칙을 반드시 따르세요:
- 제품 추천이나 셀링 글이 아님. 사람들이 궁금해하고 읽고 싶어지는 매력적인 콘텐츠를 만드는 것이 목적
- 광고/홍보/추천 느낌 완전 배제. 순수하게 재밌고 몰입되는 글
- 실제 커뮤니티 유저가 직접 쓴 것처럼 자연스럽게 작성
- 기본적으로 반말체로 작성 (톤 지정이 있으면 해당 톤으로)
- 반말일 경우 인터넷 용어/줄임말을 적극 활용 (ㅋㅋ, ㅎㅎ, ㄹㅇ, ㅇㅈ, 갓, 미쳤다, 개꿀, 존맛, 레전드, 찐, 킹받다, 띠용, 헐 등 상황에 맞게)
- 문단 사이에 줄바꿈을 넣어 읽기 편하게 구성 (빽빽한 줄글 금지)
- 마크다운, 번호 목록 사용 금지. 줄바꿈만 활용한 자연스러운 글
- 읽는 사람이 자연스럽게 관심을 갖도록 스토리텔링 활용
- 제품/서비스 추천이나 홍보 표현 넣지 않기. 글 자체가 재밌어서 사람들이 읽고 공유하는 게 목적
- 읽는 데 1분 이하로 걸리는 짧은 분량 (약 200~300자)으로 작성
- 숏츠/릴스 감성으로 임팩트 있게. 도입부터 강렬하게 시작하고, 반전이나 펀치라인으로 끝내기
- 타겟이 읽다가 자연스럽게 공유하거나 저장하고 싶어질 만큼 타겟 말투에 맞게 작성
- 관심 분야에 "연애"가 포함되어 있으면 도파민 자극되는 막장/반전 스토리로 구성 (배신, 충격 고백, 썸타다 반전, 전남친/전여친 관련 등 자극적이고 몰입감 있는 전개)
- 한국어로 작성`;

  const userPrompt = `다음 정보를 바탕으로 바이럴 글을 작성해줘.

타겟 정보
주요 타겟은 ${target.ageRange}의 ${target.gender} ${target.job}이야. 주된 관심 분야는 ${target.interests.join(", ")}이고${target.painPoint ? `, 이 사람들이 가장 크게 느끼는 고민은 ${target.painPoint}이야` : ""}. ${target.spendingType ? `소비 성향은 ${target.spendingType}이야.` : ""}

제품/서비스 정보
소개할 제품은 ${product.category ? `${product.category} 분야의 ` : ""}${product.productName}이야.${product.keyBenefit ? ` 이 제품의 가장 큰 혜택은 ${product.keyBenefit}이고,` : ""}${product.differentiator ? ` 경쟁 제품과 비교했을 때 차별점은 ${product.differentiator}이야.` : ""}
제품명을 반드시 언급할 필요는 없어. 자연스러운 흐름에서 필요할 때만 써줘.

콘텐츠 방향
${content.viralStyle ? `바이럴 방식은 ${content.viralStyle}으로 써줘. ` : ""}글의 톤은 ${toneText} 말투로 해줘. ${content.cta && content.cta !== "없음 (자연스럽게 마무리)" ? `글 마지막에는 ${content.cta}를 넣어줘.` : "글을 자연스럽게 마무리해줘."}
${additionalInfo ? `\n추가 요청사항\n${additionalInfo}` : ""}

읽는 데 1분 이하로 걸리는 짧고 임팩트 있는 바이럴 글을 3개 작성해줘.
각 글은 "---" 구분선으로 구분해줘.
각 글의 첫 줄은 제목으로 사용돼. 제목은 소설 제목처럼 거창하거나 어그로성 있게 쓰지 말고, 실제 커뮤니티에서 유저가 올릴 법한 담백하고 일상적인 제목으로 써줘. (예: "이거 나만 몰랐던 거?", "요즘 이거 쓰는데 좀 괜찮음", "솔직히 좀 놀랐다")`;

  try {
    const response = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.9,
        max_tokens: 4096,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        {
          error: `DeepSeek API 오류: ${errorData.error?.message || "알 수 없는 오류"}`,
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    const generatedContent = data.choices[0].message.content;

    const posts = generatedContent
      .split("---")
      .map((post: string) => post.trim())
      .filter((post: string) => post.length > 0);

    return NextResponse.json({ posts });
  } catch (error) {
    console.error("DeepSeek API 호출 실패:", error);
    return NextResponse.json(
      { error: "글 생성 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요." },
      { status: 500 }
    );
  }
}
