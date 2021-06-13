import { fetchTextMap } from "@/api/database/text";
import { fetchData } from "@/api/database/api";
import { fetchCurve } from "@/api/database/curve";
import {
  CurveLevelMap,
  TextMap,
  WeaponData,
  WeaponExcelConfigData,
  WeaponMap,
} from "@/types/database";
import _ from "lodash";

export async function fetchWeapons(
  text?: TextMap,
  curves?: CurveLevelMap,
): Promise<WeaponMap> {
  const data: WeaponExcelConfigData[] = await fetchData(
    "ExcelBinOutput/WeaponExcelConfigData",
  );

  const textMap = text ?? (await fetchTextMap());
  const curveMap = curves ?? (await fetchCurve("WeaponCurveExcelConfigData"));

  return _.chain(data)
    .keyBy("Id")
    .mapValues(
      (data): WeaponData => ({
        id: data.Id,
        icon: data.Icon ?? null,
        name: textMap[data.NameTextMapHash],
        description: textMap[data.DescTextMapHash],
        baseExperience: data.WeaponBaseExp,
        stars: data.RankLevel,
        type: data.WeaponType,
        properties: _.chain(data.WeaponProp)
          .filter((data) => !!data.PropType)
          .keyBy("PropType")
          .mapValues((data) => ({
            value: data.InitValue,
            curve: _.chain(Object.values(curveMap))
              .map((curve) => [curve.level, curve.info[data.Type]])
              .fromPairs()
              .value(),
          }))
          .value(),
      }),
    )
    .value();
}
