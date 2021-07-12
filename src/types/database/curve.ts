import { CombatPropertyType, CurveOperationType, GrowthCurveType } from "@/types/database/consts";

export type CurveLevelMap = Record<number, CurveLevel>;

export type CurveExcelConfigData = {
  Level: number;
  CurveInfos: {
    Type: GrowthCurveType;
    Arith: string;
    Value: number;
  }[];
};

export type CurveLevel = {
  level: number;
  info: Record<CombatPropertyType | string, CurveInfo>;
};

export type CurveInfo = {
  operation: CurveOperationType;
  value: number;
};
