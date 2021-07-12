import { AvatarSkillDepot } from "@/types/database/avatar/skill";
import { AscensionList } from "@/types/database/avatar/ascension";
import { StatType } from "@/types/database/consts";
import { RewardData } from "@/types/database/reward";
import { CurveLevel } from "@/types/database/curve";

export type AvatarMap = Record<number, AvatarData>;

export type AvatarExcelConfigData = {
  BodyType: string;
  IconName: string;
  SideIconName: string;
  QualityType: string;
  InitialWeapon: number;
  DescTextMapHash: number;
  InfoDescTextMapHash: number;
  HpBase: number;
  AttackBase: number;
  DefenseBase: number;
  Id: number;
  NameTextMapHash: number;
  AvatarPromoteRewardLevelList: number[];
  AvatarPromoteRewardIdList: number[];
  AvatarPromoteId: number;
  SkillDepotId: number;
  StaminaRecoverSpeed: number;
  WeaponType: string;
  PropGrowCurves: {
    Type: string;
    GrowCurve: string;
  }[];
};

export type AvatarData = {
  id: number;
  name: string;
  description: string;
  infoDescription: string;
  stars: number;
  bodyType: string;
  weaponType: string;
  powers: AvatarSkillDepot;
  ascension: {
    rewards: Record<number, RewardData>; // TODO: Make these type alises
    levels: AscensionList;
  };
  stats: {
    base: Record<StatType, number>;
    curves: Record<number, CurveLevel>;
  };
};
