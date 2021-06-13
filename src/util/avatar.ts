import {
  AvatarCurveInfo,
  AvatarData,
  AvatarPropertyType,
  StatType,
} from "@/types/database";
import _ from "lodash";

const statMappings: Record<StatType, { property: AvatarPropertyType }> = {
  HP: { property: "FIGHT_PROP_BASE_HP" },
  ATK: { property: "FIGHT_PROP_BASE_ATTACK" },
  DEF: { property: "FIGHT_PROP_BASE_DEFENSE" },
  STA: { property: "UNKNOWN" },
};

export const calculateStat = (
  data: AvatarData,
  type: StatType,
  level: number,
  ascension: number,
) => {
  let result = data.stats.base[type];
  const property = statMappings[type]?.property;

  const curve: AvatarCurveInfo = data.stats.curves[level].info[property];
  if (curve?.operation === "ARITH_MULTI") result *= curve?.value ?? 1;

  if (property) {
    const avatarAscension =
      data.ascension.levels.levels[
        Math.min(
          ascension,
          _.last(Object.values(data.ascension.levels.levels))?.level ?? 1,
        )
      ];

    if (avatarAscension)
      result += avatarAscension.rewards.properties[property] ?? 0;
  }

  return Math.round(result);
};
