import { fetchTextMap, TextMap } from "@/api/database/text";
import { fetchData } from "@/api/database/api";
import {
  AvatarCurveInfo,
  CharacterCurveMap,
  fetchAvatarCurve,
} from "@/api/database/avatar/curve";
import { fetchRewards, RewardData, RewardMap } from "@/api/database/reward";
import {
  AvatarAscensions,
  CharacterAscensionMap,
  fetchAvatarAscensions,
} from "@/api/database/avatar/ascend";
import { fetchMaterials, MaterialMap } from "@/api/database/material";
import {
  AvatarSkillDepot,
  fetchSkillDepot,
  SkillDepotMap,
} from "@/api/database/avatar/skill/depot";

type CharacterMap = Record<number, CharacterData>;

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

type CharacterData = {
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
    base: {
      hp: number;
      attack: number;
      defence: number;
      staminaRecover: number;
    };
    curves: Curves;
  };
};

type AscensionRewards = {
  [level: number]: RewardData;
};

type CurveInfo = {
  [type: string]: AvatarCurveInfo;
};

type Curves = {
  [level: number]: CurveInfo;
};

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
