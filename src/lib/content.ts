export type TrustItem = {
  id: string;
  value: number | string;
  suffix?: string;
  label: string;
};

export type Faq = {
  id?: string;
  q: string;
  a: string;
};
