import { CombatPropertyType } from "@/types/database/consts";
import { AscensionList } from "@/types/database/avatar/ascension";
import { CurveInfo } from "@/types/database/curve";

export type WeaponMap = Record<number, WeaponData>;

export type WeaponExcelConfigData = {
  Id: number;
  Icon?: string;
  WeaponType: string;
  RankLevel: number;
  WeaponBaseExp: number;
  NameTextMapHash: number;
  DescTextMapHash: number;
  WeaponPromoteId: number;
  WeaponProp: {
    PropType: string;
    InitValue: number;
    Type: string;
  }[];
};

export type WeaponData = {
  id: number;
  icon: string | null;
  type: string;
  stars: number;
  baseExperience: number;
  name: string;
  description: string;
  ascensions: AscensionList;
  stats: Record<
    CombatPropertyType | string,
    {
      value: number;
      curve: Record<number, CurveInfo>;
    }
  >;
};

export type WeaponPromoteExcelConfigData = {
  WeaponPromoteId: number;
  PromoteLevel: number;
  UnlockMaxLevel: number;
  RequiredPlayerLevel: number;
  CoinCost: number;
  CostItems: {
    Id: number;
    Count: number;
  }[];
  AddProps: {
    PropType: string;
    Value: number;
  }[];
};
