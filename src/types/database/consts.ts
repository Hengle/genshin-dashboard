import { tuple } from "@/util/types";

export const statType = tuple(
  "HP",
  "ATTACK",
  "DEFENCE",
  "STAMINA",
  "CRITICAL_RATE",
  "CRITICAL_DAMAGE",
  "ENERGY_RECHARGE",
  "ELEMENTAL_MASTERY",
);

export const propType = tuple(
  "FIGHT_PROP_BASE_HP",
  "FIGHT_PROP_BASE_DEFENSE",
  "FIGHT_PROP_BASE_ATTACK",
  "FIGHT_PROP_CRITICAL",
  "FIGHT_PROP_CRITICAL_HURT",
  "FIGHT_PROP_CHARGE_EFFICIENCY",
  "FIGHT_PROP_ELEMENT_MASTERY",
  "FIGHT_PROP_ATTACK_PERCENT",
  "FIGHT_PROP_PHYSICAL_ADD_HURT",
  "FIGHT_PROP_ELEC_ADD_HURT",
  "FIGHT_PROP_ICE_ADD_HURT",
  "FIGHT_PROP_WIND_ADD_HURT",
  "FIGHT_PROP_WATER_ADD_HURT",
  "FIGHT_PROP_FIRE_ADD_HURT",
  "FIGHT_PROP_ROCK_ADD_HURT",
  "FIGHT_PROP_HEAL_ADD",
  "FIGHT_PROP_HP_PERCENT",
  "FIGHT_PROP_DEFENSE_PERCENT",
);

export const growthCurveType = tuple(
  "GROW_CURVE_HP_S4",
  "GROW_CURVE_ATTACK_S4",
  "GROW_CURVE_HP_S5",
  "GROW_CURVE_ATTACK_S5",
);

export const associationType = tuple(
  "ASSOC_TYPE_MAINACTOR",
  "ASSOC_TYPE_MONDSTADT",
  "ASSOC_TYPE_LIYUE",
  "ASSOC_TYPE_INAZUMA",
  "ASSOC_TYPE_FATUI",
);

export const characterType = tuple("amber");

export type StatType = typeof statType[number];
export type CombatPropertyType = typeof propType[number];
export type GrowthCurveType = typeof growthCurveType[number];
export type AssociationType = typeof associationType[number];
export type CharacterType = typeof characterType[number];

export type PropertyFormat = "NUMBER" | "PERCENTAGE";
export type CurveOperationType = "ARITH_MULTI";

export type TextMap = Record<string, string>;
