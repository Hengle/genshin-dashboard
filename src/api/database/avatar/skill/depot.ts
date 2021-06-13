import { fetchData } from "@/api/database/api";
import {
  AvatarSkillDepotExcelConfigData,
  SkillDepotMap,
  AvatarSkillMap,
  AvatarTalentMap,
} from "@/types/database";
import { fetchSkills } from "@/api/database/avatar/skill/skill";
import { fetchTalents } from "@/api/database/avatar/skill/talent";

export async function fetchSkillDepot(
  skill?: AvatarSkillMap,
  talent?: AvatarTalentMap,
) {
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
          energy: skillMap[item.EnergySkill] ?? null,
          skills: item.Skills.map((v) => skillMap[v]).filter((v) => v),
          subSkills: item.SubSkills.map((v) => skillMap[v]).filter((v) => v),
        },
        constellations: {
          leader: talentMap[item.LeaderTalent] ?? null,
          talents: item.Talents.map((v) => talentMap[v]).filter((v) => v),
        },
      },
    }),
    {} as SkillDepotMap,
  );
}
