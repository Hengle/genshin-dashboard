import { MaterialData } from "@/types/database/material";

export type AvatarTalentMap = Record<number, AvatarTalent>;

export type AvatarTalentExcelConfigData = {
  TalentId: number;
  NameTextMapHash: number;
  DescTextMapHash: number;
  MainCostItemId: number;
  MainCostItemCount: number;
};

export type AvatarTalent = {
  id: number;
  name: string;
  description: string;
  cost: {
    item: MaterialData;
    amount: number;
  };
};
