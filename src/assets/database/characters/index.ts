import amber from "./amber";
import { CharacterKey, AvatarData } from "@/types/database";

export type CharacterCardBuilder = (data: AvatarData) => CharacterCard;

export type CharacterCard = {
  data: AvatarData;
  assets: {
    card: string;
  };
};

export const characters: Record<CharacterKey, CharacterCardBuilder> = {
  amber: amber.builder,
};
