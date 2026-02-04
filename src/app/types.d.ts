export type ContentColumn = "video_id" | "masterclass_id" | "blog_id";

export interface VideoProps {
  uid: string;
  title: string;
  url: string;
  tag: string;
  thumbnail: string;
  description: string;
  free?: boolean;
  episode?: string;
  tags?: string[];
  slug?: string | null;
}

export interface SurveyProps {
  uid: string;
  question: string;
  enabled: boolean;
}

export interface PromoCodeParams {
  id: string;
  code: string;
  amount_off: number| null;
  percent_off: number| null;
}
