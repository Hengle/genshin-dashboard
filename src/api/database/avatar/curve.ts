import { fetchData } from "@/api/database/api";
import _ from "lodash";
import {
  AvatarCurveExcelConfigData,
  CharacterCurveMap,
  CurveType,
} from "@/types/database";

export function applyCurve(
  curves: CharacterCurveMap,
  current: number,
  level: number,
  stat: CurveType,
) {
  const info = curves[level].info[stat];
  if (info.operation === "ARITH_MULTI") return current * info.value;
  return current;
}

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
