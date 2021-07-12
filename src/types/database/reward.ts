import { MaterialData } from "@/types/database/material";

export type RewardMap = Record<number, RewardData>;

export type RewardExcelConfigData = {
  RewardId: number;
  RewardItemList: {
    ItemId: number;
    ItemCount: number;
  }[];
};

export type RewardData = {
  id: number;
  items: {
    item: MaterialData;
    amount: number;
  }[];
};
