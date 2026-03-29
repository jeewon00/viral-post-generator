import { NextRequest, NextResponse } from "next/server";

async function fetchTrendingKeywords(): Promise<string[]> {
  try {
    const response = await fetch(
      "https://trends.google.co.kr/trending/rss?geo=KR",
      { cache: "no-store" }
    );
    const xml = await response.text();
    const titles = xml.match(/<title>(?!Daily Search Trends)(.+?)<\/title>/g);
    if (!titles) return [];
    return titles
      .map((t) => t.replace(/<\/?title>/g, ""))
      .slice(0, 15);
  } catch {
    return [];
  }
}

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
  useTrending: boolean;
}

export async function POST(req: NextRequest) {
  const body: RequestBody = await req.json();
  const { target, product, content, additionalInfo, useTrending } = body;

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

  const trendingKeywords = useTrending ? await fetchTrendingKeywords() : [];
  const trendingSection =
    trendingKeywords.length > 0
      ? `\n- 현재 한국에서 실시간으로 뜨고 있는 트렌드/밈 키워드: ${trendingKeywords.join(", ")}. 이 중 글의 주제와 자연스럽게 연결되는 키워드가 있으면 적극 활용해서 최신 트렌드 느낌을 살려줘. 억지로 끼워넣지 말고 맥락에 맞을 때만 사용.`
      : "";

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
- 숏츠/릴스 감성으로 임팩트 있게. 도입부터 강렬하게 시작하고, 반전이나 펀치라인으로 끝내기
- 타겟이 읽다가 자연스럽게 공유하거나 저장하고 싶어질 만큼 타겟 말투에 맞게 작성
- 관심 분야에 "연애"가 포함되어 있으면 도파민 폭발하는 극적인 막장 스토리로 구성. 수위를 최대한 올려서 작성:
  * 배신/불륜/양다리/바람 현장 목격, 친구가 내 남친/여친이랑 자고 있었음 등 충격적인 전개
  * "여친 폰 봤는데 전남친이랑 아직 잠", "썸남 인스타에 다른 여자 스토리 떠서 멘붕" 같은 극한 상황
  * 이별 후 복수/성장/재회, 전 애인 결혼식에서 재회 같은 감정 롤러코스터
  * 비속어와 거친 표현 자연스럽게 섞어서 리얼한 감정 표현 (씨발, 존나, 개같다, 미친놈/미친년, 지랄 등 실제 사람들이 분노/충격받았을 때 쓰는 표현)
  * 읽는 사람이 "헐 진짜?" "ㅋㅋㅋ 미쳤다" 하면서 몰입할 수 있는 생생한 상황 묘사
  * 결말에 반드시 소름 돋는 반전이나 킹받는 펀치라인 넣기
  * 글이 짧으면 몰입이 안 되니까 충분히 길게 써서 감정선을 제대로 살리기
- 관심 분야에 "정치"가 포함되어 있으면 정치 이슈로 논쟁+비난 폭발하는 글로 구성. 수위 최대한 올리기:
  * 최근 정치 이슈나 정책에 대한 날카로운 비난과 풍자
  * "이 나라가 진짜 답이 없는 이유", "투표하고 와서 드는 생각", "세금 내기 싫어지는 순간" 같은 분노 자극
  * 여야/진보보수 갈등, 정치인 발언에 대한 격한 비난, 세금/부동산/청년정책 등 민감한 주제
  * 한쪽 편을 확실히 들고 반대편을 신랄하게 까면서 댓글 폭발하게 만드는 도발적인 톤
  * 욕설과 거친 비속어 자연스럽게 섞기 (시발, 존나, 개같다, 미친놈들, 지랄, 썩을 등 실제 커뮤니티 톤)
  * 특정 정치인/정당을 직접 비난하는 것처럼 생생하게 작성
  * 읽는 사람이 "ㅇㅈ 시발 ㄹㅇ" 또는 "아니 이게 말이 됨?" 하면서 격하게 반응하게 유도
  * 읽는 데 최대 3분 이하 분량으로 충분히 길게, 근거와 감정을 섞어 설득력 있게 작성
- 관심 분야에 "남녀갈등"이 포함되어 있으면 성별 갈등 이슈로 바이럴되는 글로 구성. 수위 최대한 올리기:
  * 연애/결혼/데이트비용/군대/육아 등 남녀 간 시각차가 극명한 주제
  * "남자들은 진짜 이해 안 되는 게", "여자들이 이러면서 왜" 같은 한쪽 시점에서 상대 성별을 신랄하게 비난
  * 실제 커뮤니티에서 논쟁 터지는 소재 활용 (더치페이, 기사도, 맘충, 한남/한녀, 군면제, 출산 등)
  * 욕설과 거친 비속어 자연스럽게 섞기 (시발, 존나, 개같다, 미친놈/미친년, 지랄 등)
  * 상대 성별을 구체적으로 비난하고 조롱하는 톤 ("이런 남자/여자는 진짜 답이 없다", "걔네가 뭘 알아")
  * 읽는 사람이 격하게 공감하거나 격하게 반박하고 싶어지는 극단적인 톤
  * 댓글창이 전쟁터가 될 만큼 자극적이고 확실한 입장 표명
  * 읽는 데 최대 3분 이하 분량으로 충분히 길게, 사례와 감정을 섞어서 몰입감 있게 작성
- 관심 분야에 "여사친/남사친"이 포함되어 있으면 이성 사이 우정 경계선에서 벌어지는 극적 스토리로 구성:
  * "남사친이랑 술 먹다가 분위기 이상해졌는데", "여사친이 갑자기 고백해서" 같은 경계 무너지는 상황
  * 여사친/남사친 때문에 애인이랑 싸운 이야기, 질투/의심 폭발하는 전개
  * "걔는 그냥 친구라니까" vs "그게 진짜 그냥 친구임?" 양쪽 시점 충돌
  * 친구인 줄 알았는데 알고 보니 한쪽이 좋아하고 있었음, 고백 후 우정 파괴 등 반전
  * 비속어와 거친 표현 자연스럽게 섞어서 리얼한 감정 표현
  * 읽는 사람이 "와 이건 좀..." 하면서 자기 경험 떠올리게 만드는 공감 유발
  * 결말에 소름 돋는 반전이나 씁쓸한 펀치라인 넣기
- 한국어로 작성${trendingSection}`;

  const userPrompt = `다음 정보를 바탕으로 바이럴 글을 작성해줘.

타겟 정보
주요 타겟은 ${target.ageRange}의 ${target.gender} ${target.job}이야. 주된 관심 분야는 ${target.interests.join(", ")}이고${target.painPoint ? `, 이 사람들이 가장 크게 느끼는 고민은 ${target.painPoint}이야` : ""}. ${target.spendingType ? `소비 성향은 ${target.spendingType}이야.` : ""}

제품/서비스 정보
소개할 제품은 ${product.category ? `${product.category} 분야의 ` : ""}${product.productName}이야.${product.keyBenefit ? ` 이 제품의 가장 큰 혜택은 ${product.keyBenefit}이고,` : ""}${product.differentiator ? ` 경쟁 제품과 비교했을 때 차별점은 ${product.differentiator}이야.` : ""}
제품명을 반드시 언급할 필요는 없어. 자연스러운 흐름에서 필요할 때만 써줘.

콘텐츠 방향
${content.viralStyle ? `바이럴 방식은 ${content.viralStyle}으로 써줘. ` : ""}글의 톤은 ${toneText} 말투로 해줘. ${content.cta && content.cta !== "없음 (자연스럽게 마무리)" ? `글 마지막에는 ${content.cta}를 넣어줘.` : "글을 자연스럽게 마무리해줘."}
${additionalInfo ? `\n추가 요청사항\n${additionalInfo}` : ""}

임팩트 있는 바이럴 글을 3개 작성해줘. 각 글의 분량을 다르게 해줘:
- 1번째 글: 짧고 임팩트 있게 (약 150~250자)
- 2번째 글: 중간 분량으로 스토리텔링 (약 300~500자)
- 3번째 글: 길고 몰입감 있게, 감정선을 충분히 살려서 (약 500~800자)
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
