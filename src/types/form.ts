export interface FormData {
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
