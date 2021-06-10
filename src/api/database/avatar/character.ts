import { fetchTextMap, TextMap } from "@/api/database/text";
import { fetchData } from "@/api/database/api";
import {
  AvatarCurveInfo,
  CharacterCurveMap,
  fetchAvatarCurve,
} from "@/api/database/avatar/curve";

type CharacterMap = Record<number, CharacterData>;

type AvatarExcelConfigData = {
  BodyType: string;
  IconName: string;
  SideIconName: string;
  QualityType: string;
  InitialWeapon: string;
  DescTextMapHash: string;
  InfoDescTextMapHash: string;
  HpBase: number;
  AttackBase: number;
  DefenseBase: number;
  Id: number;
  NameTextMapHash: number;
  PropGrowCurves: {
    Type: string;
    GrowCurve: string;
  }[];
};

type CharacterData = {
  id: number;
  name: string;
  description: string;
  infoDescription: string;
  stars: number;
  bodyType: string;
  stats: {
    base: {
      hp: number;
      attack: number;
      defence: number;
    };
    curves: Curves;
  };
};

type CurveInfo = {
  [type: string]: AvatarCurveInfo;
};

type Curves = {
  [level: number]: CurveInfo;
};

export async function fetchCharacters(
  text?: TextMap,
  curves?: CharacterCurveMap,
) {
  const data: AvatarExcelConfigData[] = await fetchData(
    "ExcelBinOutput/AvatarExcelConfigData",
  );

  const textMap = text ?? (await fetchTextMap());
  const curveMap = curves ?? (await fetchAvatarCurve());

  return data.reduce(
    (obj, item) => ({
      ...obj,
      [item.Id ?? 0]: {
        id: item.Id ?? 0,
        name: textMap[item.NameTextMapHash],
        description: textMap[item.DescTextMapHash],
        infoDescription: textMap[item.InfoDescTextMapHash],
        stars: item.QualityType === "QUALITY_PURPLE" ? 4 : 5,
        bodyType: item.BodyType,
        stats: {
          base: {
            hp: item.HpBase,
            attack: item.AttackBase,
            defence: item.DefenseBase,
          },
          curves: Object.values(curveMap).reduce(
            (obj, entry) => ({
              ...obj,
              [entry.level]: item.PropGrowCurves.reduce(
                (obj, curve) => ({
                  ...obj,
                  [curve.Type]: curveMap[entry.level].info[curve.GrowCurve],
                }),
                {} as CurveInfo,
              ),
            }),
            {} as Curves,
          ),
        },
      },
    }),
    {} as CharacterMap,
  );
}
