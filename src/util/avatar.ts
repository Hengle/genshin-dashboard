import _ from "lodash";
import { statMap } from "@/util/mappings";
import { AscensionData, AscensionList } from "@/types/database/avatar/ascension";
import { CurveInfo } from "@/types/database/curve";
import { CombatPropertyType, StatType } from "@/types/database/consts";
import { WeaponData } from "@/types/database/weapon";
import { AvatarData } from "@/types/database/avatar/avatar";

export const calculateAvatarStat = (
  data: AvatarData,
  type: StatType,
  level: number,
  ascension: number,
) => {
  let result = data.stats.base[type];
  const property = statMap[type]?.property;

  const curve: CurveInfo = data.stats.curves[level].info[property ?? ""];
  if (curve?.operation === "ARITH_MULTI") result *= curve?.value ?? 1;

  if (property) {
    const index = Math.min(ascension, getMaxAscension(data.ascension.levels));
    const avatarAscension = data.ascension.levels.ascensions[index];
    if (avatarAscension) result += avatarAscension.rewards.properties[property] ?? 0;
  }

  return Math.round(result);
};

export const getMaxAscension = (levels: AscensionList) =>
  _.last(Object.values(levels.ascensions))?.level ?? 1;

export const getAscensionSpecialStats = (levels: AscensionData) =>
  _.chain(Object.entries(levels.rewards.properties))
    .filter(([key, value]) => !key.includes("BASE") && !!value)
    .map(([key, value]) => ({
      type: key as CombatPropertyType,
      value: value,
    }))
    .value();

export const calculateWeaponStat = (
  data: WeaponData,
  type: StatType,
  level: number,
  ascension: number,
) => {
  const property = statMap[type]?.property;
  const stat = data.stats[property ?? ""] ?? { value: 0, curve: {} };
  let result = stat.value;

  const curve: CurveInfo = stat.curve[level];
  if (curve?.operation === "ARITH_MULTI") result *= curve?.value ?? 1;

  if (property) {
    const ascensionData =
      data.ascensions.ascensions[Math.min(ascension, getMaxAscension(data.ascensions) ?? 1)];
    if (ascensionData) result += ascensionData.rewards.properties[property] ?? 0;
  }

  return Math.round(result);
};

export const getElement = (data: AvatarData) => data.powers.skills.energy?.cost.element?.type;
