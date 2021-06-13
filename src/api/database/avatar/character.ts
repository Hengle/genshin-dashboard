import { fetchTextMap } from "@/api/database/text";
import { fetchData } from "@/api/database/api";
import { fetchAvatarCurve } from "@/api/database/avatar/curve";
import {
  AvatarAscensionMap,
  AvatarCurve,
  AvatarCurveMap,
  AvatarData,
  AvatarExcelConfigData,
  AvatarMap,
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
  curves?: AvatarCurveMap,
  material?: MaterialMap,
  reward?: RewardMap,
  ascensions?: AvatarAscensionMap,
  skillDepot?: SkillDepotMap,
): Promise<AvatarMap> {
  const data: AvatarExcelConfigData[] = await fetchData(
    "ExcelBinOutput/AvatarExcelConfigData",
  );

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
        skills: skillDepotMap[data.SkillDepotId],
        stats: {
          base: {
            HP: data.HpBase,
            ATK: data.AttackBase,
            DEF: data.DefenseBase,
            STA: data.StaminaRecoverSpeed,
          },
          curves: _.chain(Object.values(curveMap))
            .keyBy("level")
            .mapValues(
              (curve): AvatarCurve => ({
                level: curve.level,
                info: _.chain(data.PropGrowCurves)
                  .keyBy("Type")
                  .mapValues(
                    (entry) => curveMap[curve.level].info[entry.GrowCurve],
                  )
                  .value(),
              }),
            )
            .value(),
        },
        ascension: {
          levels: ascensionMap[data.AvatarPromoteId],
          rewards: _.chain(data.AvatarPromoteRewardIdList)
            .map((id, index) => [
              data.AvatarPromoteRewardLevelList[index],
              rewardMap[id],
            ])
            .fromPairs()
            .value(),
        },
      }),
    )
    .value();
  // return data.reduce(
  //   (obj, item) => ({
  //     ...obj,
  //     [item.Id ?? 0]: {
  //       id: item.Id ?? 0,
  //       name: textMap[item.NameTextMapHash],
  //       description: textMap[item.DescTextMapHash],
  //       infoDescription: textMap[item.InfoDescTextMapHash],
  //       stars: item.QualityType === "QUALITY_PURPLE" ? 4 : 5,
  //       bodyType: item.BodyType,
  //       weaponType: item.WeaponType,
  //       skills: skillDepotMap[item.SkillDepotId],
  //       stats: {
  //         base: {
  //           HP: item.HpBase,
  //           ATK: item.AttackBase,
  //           DEF: item.DefenseBase,
  //           STA: item.StaminaRecoverSpeed,
  //         },
  //         curves: Object.values(curveMap).reduce(
  //           (obj, entry) => ({
  //             ...obj,
  //             [entry.level]: {
  //               level: entry.level,
  //               info: item.PropGrowCurves.reduce(
  //                 (obj, curve) => ({
  //                   ...obj,
  //                   [curve.Type]: curveMap[entry.level].info[curve.GrowCurve],
  //                 }),
  //                 {},
  //               ),
  //             } as AvatarCurve,
  //           }),
  //           {} as Record<number, AvatarCurve>,
  //         ),
  //       },
  //       ascension: {
  //         rewards: item.AvatarPromoteRewardLevelList.map((v, index) => [
  //           v,
  //           item.AvatarPromoteRewardIdList[index],
  //         ]).reduce(
  //           (obj, [level, id]) => ({
  //             ...obj,
  //             [level]: rewardMap[id],
  //           }),
  //           {} as AscensionRewards,
  //         ),
  //         levels: ascensionMap[item.AvatarPromoteId],
  //       },
  //     } as AvatarData,
  //   }),
  //   {} as AvatarMap,
  // );
}
