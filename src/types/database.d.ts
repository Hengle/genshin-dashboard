export type CharacterKey = "amber";
export type StatType = "HP" | "ATK" | "DEF" | "STA";
export type AvatarPropertyType =
  | "FIGHT_PROP_BASE_HP"
  | "FIGHT_PROP_BASE_DEFENSE"
  | "FIGHT_PROP_BASE_ATTACK"
  | "FIGHT_PROP_CRITICAL_HURT"
  | string;

type GrowthCurveType =
  | "GROW_CURVE_HP_S4"
  | "GROW_CURVE_ATTACK_S4"
  | "GROW_CURVE_HP_S5"
  | "GROW_CURVE_ATTACK_S5";

export type SkillDepotMap = Record<number, AvatarSkillDepot>;
export type AvatarTalentMap = Record<number, AvatarTalent>;
export type AvatarSkillMap = Record<number, AvatarSkill>;
export type AvatarAscensionMap = Record<number, AvatarAscensions>;
export type AvatarCurveMap = Record<number, AvatarCurve>;
export type MaterialMap = Record<number, MaterialData>;
export type RewardMap = Record<number, RewardData>;
export type TextMap = Record<string, string>;

type AvatarMap = Record<number, AvatarData>;
type AchievementMap = Record<number, Achievement>;
type AchievementCategoryMap = Record<number, AchievementCategory>;

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
    skills: AvatarSkill[];
    subSkills: AvatarSkill[];
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
    element: {
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
    PropType: AvatarPropertyType;
    Value?: number;
  }[];
  CostItems: {
    Id: number;
    Count: number;
  }[];
};

export type AvatarAscensions = {
  id: number;
  levels: Record<number, AvatarAscension>;
};

type AvatarAscension = {
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
    properties: Record<AvatarPropertyType, number>;
  };
};

type AvatarExcelConfigData = {
  BodyType: string;
  IconName: string;
  SideIconName: string;
  QualityType: string;
  InitialWeapon: string;
  DescTextMapHash: string;
  InfoDescTextMapHash: string;
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
  skills: AvatarSkillDepot;
  ascension: {
    rewards: AscensionRewards;
    levels: AvatarAscensions;
  };
  stats: {
    base: Record<StatType, number>;
    curves: Record<number, AvatarCurve>;
  };
};

type AscensionRewards = {
  [level: number]: RewardData;
};

type AvatarCurveExcelConfigData = {
  Level: number;
  CurveInfos: {
    Type: GrowthCurveType;
    Arith: string;
    Value: number;
  }[];
};

type AvatarCurve = {
  level: number;
  info: Record<AvatarPropertyType, AvatarCurveInfo>;
};

export type AvatarCurveInfo = {
  operation: "ARITH_MULTI" | string;
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
