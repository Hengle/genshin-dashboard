import { fetchData } from "@/api/database/api";
import _ from "lodash";
import {
  AvatarCurve,
  AvatarCurveExcelConfigData,
  AvatarCurveMap,
} from "@/types/database";

export async function fetchAvatarCurve() {
  const data: AvatarCurveExcelConfigData[] = await fetchData(
    "ExcelBinOutput/AvatarCurveExcelConfigData",
  );

  return data.reduce(
    (obj, item) =>
      ({
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
        } as AvatarCurve,
      } as AvatarCurveMap),
    {} as AvatarCurveMap,
  );
}
