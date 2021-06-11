import { fetchData } from "@/api/database/api";
import {
  AvatarSkill,
  fetchSkills,
  SkillMap,
} from "@/api/database/avatar/skill/skill";

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
  energy: AvatarSkill;
  skills: AvatarSkill[];
  subSkills: AvatarSkill[];
};

export async function fetchSkillDepot(skills?: SkillMap) {
  const data: AvatarSkillDepotExcelConfigData[] = await fetchData(
    "ExcelBinOutput/AvatarSkillDepotExcelConfigData",
  );

  const skillMap = skills ?? (await fetchSkills());

  return data.reduce(
    (obj, item) => ({
      ...obj,
      [item.Id ?? 0]: {
        id: item.Id ?? 0,
        energy: skillMap[item.EnergySkill],
        skills: item.Skills.map((v) => skillMap[v]).filter((v) => v),
        subSkills: item.SubSkills.map((v) => skillMap[v]).filter((v) => v),
      },
    }),
    {} as SkillDepotMap,
  );
}
