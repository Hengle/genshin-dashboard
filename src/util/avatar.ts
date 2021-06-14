import {
  AvatarData,
  CurveInfo,
  CurvePropertyType,
  StatType,
  WeaponData,
} from "@/types/database";
import _ from "lodash";

const statMappings: Record<StatType, { property: CurvePropertyType }> = {
  HP: { property: "FIGHT_PROP_BASE_HP" },
  ATTACK: { property: "FIGHT_PROP_BASE_ATTACK" },
  DEFENCE: { property: "FIGHT_PROP_BASE_DEFENSE" },
  CHARGE_EFFICIENCY: { property: "FIGHT_PROP_CHARGE_EFFICIENCY" },
  CRITICAL_DAMAGE: { property: "FIGHT_PROP_CRITICAL_HURT" },
  CRITICAL_RATE: { property: "FIGHT_PROP_CRITICAL" },
  ELEMENTAL_MASTERY: { property: "FIGHT_PROP_ELEMENT_MASTERY" },
  STAMINA: { property: "UNKNOWN" },
};

export const calculateAvatarStat = (
  data: AvatarData,
  type: StatType,
  level: number,
  ascension: number,
) => {
  let result = data.stats.base[type];
  const property = statMappings[type]?.property;

  const curve: CurveInfo = data.stats.curves[level].info[property];
  if (curve?.operation === "ARITH_MULTI") result *= curve?.value ?? 1;

  if (property) {
    const avatarAscension =
      data.ascension.levels.ascensions[
        Math.min(
          ascension,
          _.last(Object.values(data.ascension.levels.ascensions))?.level ?? 1,
        )
      ];

    if (avatarAscension)
      result += avatarAscension.rewards.properties[property] ?? 0;
  }

  return Math.round(result);
};

export const calculateWeaponStat = (
  data: WeaponData,
  type: StatType,
  level: number,
  ascension: number,
) => {
  console.log(data.stats);
  const property = statMappings[type]?.property;
  const stat = data.stats[property] ?? { value: 0, curve: {} };
  let result = stat.value;

  const curve: CurveInfo = stat.curve[level];
  console.log(stat.curve);
  if (curve?.operation === "ARITH_MULTI") result *= curve?.value ?? 1;

  if (property) {
    const ascensionData =
      data.ascensions.ascensions[
        Math.min(
          ascension,
          _.last(Object.values(data.ascensions.ascensions))?.level ?? 1,
        )
      ];

    if (ascensionData)
      result += ascensionData.rewards.properties[property] ?? 0;
  }

  return Math.round(result);
};

export const getElement = (data: AvatarData) =>
  data.powers.skills.energy?.cost.element?.type;
