import { fetchData } from "@/api/database/api";
import _ from "lodash";

export type CharacterCurveMap = Record<number, AvatarCurve>;

type AvatarCurveExcelConfigData = {
  Level: number;
  CurveInfos: {
    Type: string;
    Arith: string;
    Value: number;
  }[];
};

type AvatarCurve = {
  level: number;
  info: {
    [type: string]: AvatarCurveInfo;
  };
};

export type AvatarCurveInfo = {
  operation: "ARITH_MULTI" | string;
  value: number;
};

export async function fetchAvatarCurve() {
  const data: AvatarCurveExcelConfigData[] = await fetchData(
    "ExcelBinOutput/AvatarCurveExcelConfigData",
  );

  return data.reduce(
    (obj, item) => ({
      ...obj,
      [item.Level ?? 0]: {
        level: item.Level ?? 0,
        info: _.fromPairs(
          item.CurveInfos.map((v) => [
            v.Type,
            {
              operation: v.Arith,
              value: v.Value,
            },
          ]),
        ),
      },
    }),
    {} as CharacterCurveMap,
  );
}
