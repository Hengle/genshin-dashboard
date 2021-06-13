import { fetchData } from "@/api/database/api";
import _ from "lodash";
import {
  AvatarCurve,
  AvatarCurveExcelConfigData,
  AvatarCurveInfo,
  AvatarCurveMap,
} from "@/types/database";

export async function fetchAvatarCurve(): Promise<AvatarCurveMap> {
  const data: AvatarCurveExcelConfigData[] = await fetchData(
    "ExcelBinOutput/AvatarCurveExcelConfigData",
  );

  return _.chain(data)
    .keyBy((data) => data.Level ?? 0)
    .mapValues(
      (data): AvatarCurve => ({
        level: data.Level ?? 0,
        info: _.chain(data.CurveInfos)
          .keyBy("Type")
          .mapValues(
            (data): AvatarCurveInfo => ({
              operation: data.Arith,
              value: data.Value,
            }),
          )
          .value(),
      }),
    )
    .value();
}
