import { AvatarTalent } from "@/types/database/avatar/talent";

export type SkillDepotMap = Record<number, AvatarSkillDepot>;
export type AvatarSkillMap = Record<number, AvatarSkill>;

export type AvatarSkillDepotExcelConfigData = {
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

export type AvatarSkillExcelConfigData = {
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
