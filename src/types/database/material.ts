export type MaterialMap = Record<number, MaterialData>;

export type MaterialExcelConfigData = {
  Id: number;
  NameTextMapHash: number;
  DescTextMapHash: number;
  InteractionTitleTextMapHash: number;
  EffectDescTextMapHash: number;
  SpecialDescTextMapHash: number;
  TypeDescTextMapHash: number;
  RankLevel?: number;
  Icon?: string;
};

export type MaterialData = {
  id: number;
  name: string;
  description: string;
  interactionTitle: string;
  effectDescription: string;
  specialDescription: string;
  type: string;
  stars: number;
  icon?: string;
};
