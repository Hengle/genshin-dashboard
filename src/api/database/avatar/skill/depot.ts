import { fetchData } from "@/api/database/api";
import {
  AvatarSkill,
  fetchSkills,
  SkillMap,
} from "@/api/database/avatar/skill/skill";
import {
  AvatarTalent,
  fetchTalents,
  TalentMap,
} from "@/api/database/avatar/skill/talent";

export type SkillDepotMap = Record<number, AvatarSkillDepot>;

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
    energy: AvatarSkill;
    skills: AvatarSkill[];
    subSkills: AvatarSkill[];
  };
  constellations: {
    leader: AvatarTalent;
    talents: AvatarTalent[];
  };
};

export async function fetchSkillDepot(skill?: SkillMap, talent?: TalentMap) {
  const data: AvatarSkillDepotExcelConfigData[] = await fetchData(
    "ExcelBinOutput/AvatarSkillDepotExcelConfigData",
  );

  const skillMap = skill ?? (await fetchSkills());
  const talentMap = talent ?? (await fetchTalents());

  return data.reduce(
    (obj, item) => ({
      ...obj,
      [item.Id ?? 0]: {
        id: item.Id ?? 0,
        skills: {
          energy: skillMap[item.EnergySkill],
          skills: item.Skills.map((v) => skillMap[v]).filter((v) => v),
          subSkills: item.SubSkills.map((v) => skillMap[v]).filter((v) => v),
        },
        constellations: {
          leader: talentMap[item.LeaderTalent],
          talents: item.Talents.map((v) => talentMap[v]).filter((v) => v),
        },
      },
    }),
    {} as SkillDepotMap,
  );
}
