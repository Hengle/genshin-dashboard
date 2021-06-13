import { fetchData } from "@/api/database/api";
import _ from "lodash";
import {
  CurveLevel,
  CurveExcelConfigData,
  CurveInfo,
  CurveLevelMap,
} from "@/types/database";

export async function fetchCurve(path: string): Promise<CurveLevelMap> {
  const data: CurveExcelConfigData[] = await fetchData(
    `ExcelBinOutput/${path}`,
  );

  return _.chain(data)
    .keyBy((data) => data.Level ?? 0)
    .mapValues(
      (data): CurveLevel => ({
        level: data.Level ?? 0,
        info: _.chain(data.CurveInfos)
          .keyBy("Type")
          .mapValues(
            (data): CurveInfo => ({
              operation: data.Arith,
              value: data.Value,
            }),
          )
          .value(),
      }),
    )
    .value();
}
