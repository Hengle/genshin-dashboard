import React from "react";
import { InferGetStaticPropsType } from "next";
import { fetchCharacters } from "@/api/database/avatar/character";
import { Card, Col, Row } from "antd";
import { CharacterCard, characters } from "@/assets/database/characters";
import { applyCurve, fetchAvatarCurve } from "@/api/database/avatar/curve";
import { CharacterCurveMap } from "@/types/database";

type CharacterCardProps = {
  character: CharacterCard;
  curves: CharacterCurveMap;
};

const CharacterComponent = ({ character, curves }: CharacterCardProps) => (
  <div>
    <Row>
      <Col>
        <img alt="" src={character.assets.card} width="30%" />
        <h1>{character.data.name}</h1>
      </Col>
      <Col>
        <h1>Base Stats</h1>
        <p>
          HP:
          {applyCurve(
            curves,
            character.data.stats.base.hp,
            50,
            "GROW_CURVE_HP_S4",
          )}
        </p>
        <p>ATK: {character.data.stats.base.attack}</p>
        <p>DEF: {character.data.stats.base.defence}</p>
        <p>STM: {character.data.stats.base.staminaRecover}</p>
      </Col>
    </Row>
  </div>
);

const Characters = ({
  characters: chars,
  curves,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const character = "amber";
  const user = characters[character]?.(
    chars.filter((v) => v.name.toLowerCase() === character.toLowerCase())[0],
  );

  return (
    <div>
      <h1>Database: Characters</h1>
      <Card>
        <CharacterComponent character={user} curves={curves} />
      </Card>
    </div>
  );
};

export const getStaticProps = async () => ({
  props: {
    characters: Object.values(await fetchCharacters())
      .filter((v) => v.name.length > 0)
      .map((v) => ({
        ...v,
        key: v.id,
      })),
    curves: await fetchAvatarCurve(),
  },
});

export default Characters;
