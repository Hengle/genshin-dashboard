import { fetchTextMap } from "@/api/database/text";
import { fetchAvatarCurve } from "@/api/database/curve";
import {
  AscensionMap,
  AvatarData,
  AvatarExcelConfigData,
  AvatarMap,
  CurveLevel,
  CurveLevelMap,
  MaterialMap,
  RewardMap,
  SkillDepotMap,
  TextMap,
} from "@/types/database";
import { fetchMaterials } from "@/api/database/material";
import { fetchRewards } from "@/api/database/reward";
import { fetchAvatarAscensions } from "@/api/database/avatar/ascend";
import { fetchSkillDepot } from "@/api/database/avatar/skill/depot";
import _ from "lodash";

// TODO:
// * InitialWeapon
export async function fetchAvatars(
  text?: TextMap,
  curves?: CurveLevelMap,
  material?: MaterialMap,
  reward?: RewardMap,
  ascensions?: AscensionMap,
  skillDepot?: SkillDepotMap,
): Promise<AvatarMap> {
  const data = (
    await import("../../../external/GenshinData/ExcelBinOutput/AvatarExcelConfigData.json")
  ).default as AvatarExcelConfigData[];

  const textMap = text ?? (await fetchTextMap());
  const curveMap = curves ?? (await fetchAvatarCurve());
  const materialMap = material ?? (await fetchMaterials(textMap));
  const rewardMap = reward ?? (await fetchRewards(materialMap));
  const ascensionMap = ascensions ?? (await fetchAvatarAscensions(materialMap));
  const skillDepotMap = skillDepot ?? (await fetchSkillDepot());

  return _.chain(data)
    .keyBy((data) => data.Id ?? 0)
    .mapValues(
      (data): AvatarData => ({
        id: data.Id ?? 0,
        name: textMap[data.NameTextMapHash],
        description: textMap[data.DescTextMapHash],
        infoDescription: textMap[data.InfoDescTextMapHash],
        stars: data.QualityType === "QUALITY_PURPLE" ? 4 : 5,
        bodyType: data.BodyType,
        weaponType: data.WeaponType,
        powers: skillDepotMap[data.SkillDepotId],
        stats: {
          base: {
            HP: data.HpBase,
            ATTACK: data.AttackBase,
            DEFENCE: data.DefenseBase,
            STAMINA: data.StaminaRecoverSpeed,
            ELEMENTAL_MASTERY: 0,
            CRITICAL_RATE: 0,
            CRITICAL_DAMAGE: 0,
            ENERGY_RECHARGE: 0,
          },
          curves: _.chain(Object.values(curveMap))
            .keyBy("level")
            .mapValues(
              (curve): CurveLevel => ({
                level: curve.level,
                info: _.chain(data.PropGrowCurves)
                  .keyBy("Type")
                  .mapValues((entry) => curveMap[curve.level].info[entry.GrowCurve])
                  .value(),
              }),
            )
            .value(),
        },
        ascension: {
          levels: ascensionMap[data.AvatarPromoteId],
          rewards: _.chain(data.AvatarPromoteRewardIdList)
            .map((id, index) => [data.AvatarPromoteRewardLevelList[index], rewardMap[id]])
            .fromPairs()
            .value(),
        },
      }),
    )
    .value();
}
