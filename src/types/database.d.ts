import { statTypes } from "@/types/consts";

export type CharacterKey = "amber" | string;
export type StatType = typeof statTypes[number];

export type PropertyFormat = "NUMBER" | "PERCENTAGE";

export type CurvePropertyType =
  | "FIGHT_PROP_BASE_HP"
  | "FIGHT_PROP_BASE_DEFENSE"
  | "FIGHT_PROP_BASE_ATTACK"
  | "FIGHT_PROP_CRITICAL"
  | "FIGHT_PROP_CRITICAL_HURT"
  | "FIGHT_PROP_CHARGE_EFFICIENCY"
  | "FIGHT_PROP_ELEMENT_MASTERY"
  | "FIGHT_PROP_ATTACK_PERCENT"
  | "FIGHT_PROP_PHYSICAL_ADD_HURT"
  | "FIGHT_PROP_ELEC_ADD_HURT"
  | "FIGHT_PROP_ICE_ADD_HURT"
  | "FIGHT_PROP_WIND_ADD_HURT"
  | "FIGHT_PROP_WATER_ADD_HURT"
  | "FIGHT_PROP_FIRE_ADD_HURT"
  | "FIGHT_PROP_ROCK_ADD_HURT"
  | "FIGHT_PROP_HEAL_ADD"
  | "FIGHT_PROP_HP_PERCENT"
  | "FIGHT_PROP_DEFENSE_PERCENT"
  | string;

type GrowthCurveType =
  | "GROW_CURVE_HP_S4"
  | "GROW_CURVE_ATTACK_S4"
  | "GROW_CURVE_HP_S5"
  | "GROW_CURVE_ATTACK_S5";

type AssociationType =
  | "ASSOC_TYPE_MONDSTADT"
  | "ASSOC_TYPE_LIYUE"
  | "ASSOC_TYPE_INAZUMA"
  | "ASSOC_TYPE_MAINACTOR"
  | "ASSOC_TYPE_FATUI";

type CurveOperationType = "ARITH_MULTI";

export type SkillDepotMap = Record<number, AvatarSkillDepot>;
export type AvatarTalentMap = Record<number, AvatarTalent>;
export type AvatarSkillMap = Record<number, AvatarSkill>;
export type AscensionMap = Record<number, AscensionList>;
export type CurveLevelMap = Record<number, CurveLevel>;
export type MaterialMap = Record<number, MaterialData>;
export type RewardMap = Record<number, RewardData>;
export type FetterInfoMap = Record<number, FetterInfo>;
export type WeaponMap = Record<number, WeaponData>;
export type TextMap = Record<string, string>;

type AvatarMap = Record<number, AvatarData>;
type AchievementMap = Record<number, Achievement>;
type AchievementCategoryMap = Record<number, AchievementCategory>;

export type FetterInfoExcelConfigData = {
  AvatarNativeTextMapHash: number;
  AvatarVisionBeforTextMapHash: number;
  AvatarConstellationBeforTextMapHash: number;
  AvatarTitleTextMapHash: number;
  AvatarDetailTextMapHash: number;
  AvatarAssocType: string;
  AvatarId: number;
};

export type FetterInfo = {
  title: string;
  description: string;
  region: string;
  element: string; // TODO: Typealias but future
  constellation: string;
  association: AssociationType;
};

type AvatarSkillDepotExcelConfigData = {
  Id: number;
  EnergySkill: number;
  Skills: number[];
  SubSkills: number[];
  LeaderTalent: number;
  Talents: number[];

  // TODO: InherentProudSkillOpens
};

export type AvatarSkillDepot = {
  id: number;
  skills: {
    energy?: AvatarSkill;
    combat: AvatarSkill[];
    secondary: AvatarSkill[];
  };
  constellations: {
    leader?: AvatarTalent;
    talents: AvatarTalent[];
  };
};

type AvatarSkillExcelConfigData = {
  Id: number;
  NameTextMapHash: number;
  DescTextMapHash: number;
  CdTime?: number;
  MaxChargeNum: number;
  CostElemType?: string;
  CostElemVal?: number;
  TriggerID?: number;
};

export type AvatarSkill = {
  id: number;
  name: string;
  description: string;
  cooldown: {
    time: number;
    charges: number;
  };
  cost: {
    element?: {
      type: string;
      value: number;
    } | null;
  };
};

type AvatarTalentExcelConfigData = {
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

type AvatarPromoteExcelConfigData = {
  AvatarPromoteId: number;
  PromoteLevel?: number;
  ScoinCost?: number;
  UnlockMaxLevel: number;
  RequiredPlayerLevel: number;
  AddProps: {
    PropType: CurvePropertyType;
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

type AscensionData = {
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
    properties: Record<CurvePropertyType, number>;
  };
};

type AvatarExcelConfigData = {
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

type CurveExcelConfigData = {
  Level: number;
  CurveInfos: {
    Type: GrowthCurveType;
    Arith: string;
    Value: number;
  }[];
};

type CurveLevel = {
  level: number;
  info: Record<CurvePropertyType, CurveInfo>;
};

export type CurveInfo = {
  operation: CurveOperationType;
  value: number;
};

type AchievementExcelConfigData = {
  TitleTextMapHash: number;
  DescTextMapHash: number;
  FinishRewardId: number;
  Id: number;
  GoalId: number;
  Progress: number;
  PreStageAchievementId: number;
  TriggerConfig: {
    TriggerType: string;
    ParamList: string[];
  };
};

export type Achievement = {
  id: number;
  name: string;
  description: string;
  progress: number;
  reward: RewardData;
  trigger: AchievementTrigger;
  category: AchievementCategory;
  requirementId?: number;
};

interface AchievementTrigger {
  type: string;
  parameters?: string[];
  items?: MaterialData[];
  stars?: number;
}

type AchievementGoalExcelConfigData = {
  Id: number;
  NameTextMapHash: number;
};

type AchievementCategory = {
  id: number;
  name: string;
};

type MaterialExcelConfigData = {
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

type RewardExcelConfigData = {
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
    CurvePropertyType,
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
