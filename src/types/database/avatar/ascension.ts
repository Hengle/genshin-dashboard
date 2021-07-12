import { CombatPropertyType } from "@/types/database/consts";
import { MaterialData } from "@/types/database/material";

export type AscensionMap = Record<number, AscensionList>;

export type AvatarPromoteExcelConfigData = {
  AvatarPromoteId: number;
  PromoteLevel?: number;
  ScoinCost?: number;
  UnlockMaxLevel: number;
  RequiredPlayerLevel: number;
  AddProps: {
    PropType: CombatPropertyType;
    Value?: number;
  }[];
  CostItems: {
    Id: number;
    Count: number;
  }[];
};

export type AscensionList = {
  id: number;
  ascensions: Record<number, AscensionData>;
};

export type AscensionData = {
  id: number;
  level: number;
  requiredLevel: number;
  cost: {
    coins: number;
    items: {
      item: MaterialData;
      amount: number;
    }[];
  };
  rewards: {
    unlockLevel: number;
    properties: Record<CombatPropertyType | string, number>;
  };
};
