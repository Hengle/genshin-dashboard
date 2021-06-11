import { fetchTextMap } from "@/api/database/text";
import { fetchData } from "@/api/database/api";
import { fetchAvatarCurve } from "@/api/database/avatar/curve";
import {
  AscensionRewards,
  AvatarExcelConfigData,
  CharacterAscensionMap,
  CharacterCurveMap,
  CharacterMap,
  CurveInfo,
  Curves,
  MaterialMap,
  RewardMap,
  SkillDepotMap,
  TextMap,
} from "@/types/database";
import { fetchMaterials } from "@/api/database/material";
import { fetchRewards } from "@/api/database/reward";
import { fetchAvatarAscensions } from "@/api/database/avatar/ascend";
import { fetchSkillDepot } from "@/api/database/avatar/skill/depot";

// TODO:
// * InitialWeapon
export async function fetchCharacters(
  text?: TextMap,
  curves?: CharacterCurveMap,
  material?: MaterialMap,
  reward?: RewardMap,
  ascensions?: CharacterAscensionMap,
  skillDepot?: SkillDepotMap,
) {
  const data: AvatarExcelConfigData[] = await fetchData(
    "ExcelBinOutput/AvatarExcelConfigData",
  );

  const textMap = text ?? (await fetchTextMap());
  const curveMap = curves ?? (await fetchAvatarCurve());
  const materialMap = material ?? (await fetchMaterials(textMap));
  const rewardMap = reward ?? (await fetchRewards(materialMap));
  const ascensionMap = ascensions ?? (await fetchAvatarAscensions(materialMap));
  const skillDepotMap = skillDepot ?? (await fetchSkillDepot());

  return data.reduce(
    (obj, item) => ({
      ...obj,
      [item.Id ?? 0]: {
        id: item.Id ?? 0,
        name: textMap[item.NameTextMapHash],
        description: textMap[item.DescTextMapHash],
        infoDescription: textMap[item.InfoDescTextMapHash],
        stars: item.QualityType === "QUALITY_PURPLE" ? 4 : 5,
        bodyType: item.BodyType,
        weaponType: item.WeaponType,
        skills: skillDepotMap[item.SkillDepotId],
        stats: {
          base: {
            hp: item.HpBase,
            attack: item.AttackBase,
            defence: item.DefenseBase,
            staminaRecover: item.StaminaRecoverSpeed,
          },
          curves: Object.values(curveMap).reduce(
            (obj, entry) => ({
              ...obj,
              [entry.level]: item.PropGrowCurves.reduce(
                (obj, curve) => ({
                  ...obj,
                  [curve.Type]: curveMap[entry.level].info[curve.GrowCurve],
                }),
                {} as CurveInfo,
              ),
            }),
            {} as Curves,
          ),
        },
        ascension: {
          rewards: item.AvatarPromoteRewardLevelList.map((v, index) => [
            v,
            item.AvatarPromoteRewardIdList[index],
          ]).reduce(
            (obj, [level, id]) => ({
              ...obj,
              [level]: rewardMap[id],
            }),
            {} as AscensionRewards,
          ),
          levels: ascensionMap[item.AvatarPromoteId],
        },
      },
    }),
    {} as CharacterMap,
  );
}
