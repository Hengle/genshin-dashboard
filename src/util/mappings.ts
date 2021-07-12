import _ from "lodash";
import { CombatPropertyType, PropertyFormat, StatType } from "@/types/database/consts";

export const combatMap: {
  property?: CombatPropertyType;
  stat?: StatType;
  format: PropertyFormat;
  name: string;
}[] = [
  {
    property: "FIGHT_PROP_BASE_HP",
    stat: "HP",
    format: "NUMBER",
    name: "Health",
  },
  {
    property: "FIGHT_PROP_BASE_ATTACK",
    stat: "ATTACK",
    format: "NUMBER",
    name: "Attack",
  },
  {
    property: "FIGHT_PROP_BASE_DEFENSE",
    stat: "DEFENCE",
    format: "NUMBER",
    name: "Defence",
  },
  {
    property: "FIGHT_PROP_CHARGE_EFFICIENCY",
    stat: "ENERGY_RECHARGE",
    format: "PERCENTAGE",
    name: "Energy Recharge",
  },
  {
    property: "FIGHT_PROP_CRITICAL_HURT",
    stat: "CRITICAL_DAMAGE",
    format: "PERCENTAGE",
    name: "Critical Damage",
  },
  {
    property: "FIGHT_PROP_CRITICAL",
    stat: "CRITICAL_RATE",
    format: "PERCENTAGE",
    name: "Critical Rate",
  },
  {
    property: "FIGHT_PROP_ELEMENT_MASTERY",
    stat: "ELEMENTAL_MASTERY",
    format: "NUMBER",
    name: "Elemental Mastery",
  },
  {
    stat: "STAMINA",
    format: "NUMBER",
    name: "Stamina",
  },
  {
    property: "FIGHT_PROP_ATTACK_PERCENT",
    format: "PERCENTAGE",
    name: "Attack %",
  },
  {
    property: "FIGHT_PROP_DEFENSE_PERCENT",
    format: "PERCENTAGE",
    name: "Defence %",
  },
  {
    property: "FIGHT_PROP_PHYSICAL_ADD_HURT",
    format: "PERCENTAGE",
    name: "Physical Damage Bonus",
  },
  {
    property: "FIGHT_PROP_ELEC_ADD_HURT",
    format: "PERCENTAGE",
    name: "Electro Damage Bonus",
  },
  {
    property: "FIGHT_PROP_ICE_ADD_HURT",
    format: "PERCENTAGE",
    name: "Cryo Damage Bonus",
  },
  {
    property: "FIGHT_PROP_WIND_ADD_HURT",
    format: "PERCENTAGE",
    name: "Anemo Damage Bonus",
  },
  {
    property: "FIGHT_PROP_WATER_ADD_HURT",
    format: "PERCENTAGE",
    name: "Hydro Damage Bonus",
  },
  {
    property: "FIGHT_PROP_FIRE_ADD_HURT",
    format: "PERCENTAGE",
    name: "Pyro Damage Bonus",
  },
  {
    property: "FIGHT_PROP_ROCK_ADD_HURT",
    format: "PERCENTAGE",
    name: "Geo Damage Bonus",
  },
  {
    property: "FIGHT_PROP_HEAL_ADD",
    format: "PERCENTAGE",
    name: "Healing Bonus",
  },
  {
    property: "FIGHT_PROP_HP_PERCENT",
    format: "PERCENTAGE",
    name: "Health Bonus",
  },
];

export const formatMap: Record<PropertyFormat, (value: number) => string> = {
  NUMBER: (value) => value.toString(),
  PERCENTAGE: (value) => `${Math.round(value * 100)}%`,
};

export const propertyMap = _.keyBy(combatMap, "property");
export const statMap = _.keyBy(combatMap, "stat");
