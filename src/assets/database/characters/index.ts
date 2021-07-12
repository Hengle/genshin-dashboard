import amber from "./amber";
import { AvatarData } from "@/types/database/avatar/avatar";
import { CharacterType } from "@/types/database/consts";

// TODO: Restructure this entire thing
export type CharacterCardBuilder = (data: AvatarData) => CharacterCard;

export type CharacterCard = {
  data: AvatarData;
  assets: {
    card: string;
  };
};

export const characters: Record<CharacterType | string, CharacterCardBuilder> = {
  amber: amber.builder,
};
