import { AssociationType } from "@/types/database/consts";

export type FetterInfoMap = Record<number, FetterInfo>;

export type FetterInfoExcelConfigData = {
  AvatarNativeTextMapHash: number;
  AvatarVisionBeforTextMapHash: number;
  AvatarConstellationBeforTextMapHash: number;
  AvatarTitleTextMapHash: number;
  AvatarDetailTextMapHash: number;
  AvatarAssocType: string;
  AvatarId: number;
};

export type FetterInfo = {
  title: string;
  description: string;
  region: string;
  element: string; // TODO: Typealias but future
  constellation: string;
  association: AssociationType;
};
