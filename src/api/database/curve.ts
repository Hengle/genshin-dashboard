import _ from "lodash";
import {
  CurveExcelConfigData,
  CurveInfo,
  CurveLevel,
  CurveLevelMap,
} from "@/types/database";

export const fetchAvatarCurve = async () =>
  fetchCurve(
    (
      await import(
        "../../external/GenshinData/ExcelBinOutput/AvatarCurveExcelConfigData.json"
      )
    ).default as CurveExcelConfigData[],
  );

export const fetchWeaponCurve = async () =>
  fetchCurve(
    (
      await import(
        "../../external/GenshinData/ExcelBinOutput/WeaponCurveExcelConfigData.json"
      )
    ).default as CurveExcelConfigData[],
  );

const fetchCurve = (data: CurveExcelConfigData[]): CurveLevelMap =>
  _.chain(data)
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
