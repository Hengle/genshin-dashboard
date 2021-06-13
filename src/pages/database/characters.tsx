import React, { useState } from "react";
import { InferGetStaticPropsType } from "next";
import { fetchCharacters } from "@/api/database/avatar/character";
import { Card, Col, InputNumber, Row } from "antd";
import { CharacterCard, characters } from "@/assets/database/characters";
import { calculateStat } from "@/util/avatar";

type CharacterCardProps = {
  character: CharacterCard;
  level: number;
  ascension: number;
};

const CharacterComponent = ({
  character,
  level,
  ascension,
}: CharacterCardProps) => (
  <div>
    <Row>
      <Col>
        <img alt="" src={character.assets.card} width="30%" />
        <h1>{character.data.name}</h1>
      </Col>
      <Col>
        <h1>Base Stats</h1>
        <p>HP: {calculateStat(character.data, "HP", level, ascension)}</p>
        <p>ATK: {calculateStat(character.data, "ATK", level, ascension)}</p>
        <p>DEF: {calculateStat(character.data, "DEF", level, ascension)}</p>
        <p>STA: {calculateStat(character.data, "STA", level, ascension)}</p>
      </Col>
    </Row>
  </div>
);

const Characters = ({
  characters: chars,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const character = "amber";
  const user = characters[character]?.(
    chars.filter((v) => v.name.toLowerCase() === character.toLowerCase())[0],
  );

  const [level, setLevel] = useState(1);
  const [ascension, setAscension] = useState(1);

  return (
    <div>
      <h1>Database: Characters</h1>
      <Card>
        <InputNumber
          min={1}
          max={90}
          defaultValue={level}
          onChange={(level) => setLevel(level ?? 1)}
        />
        <InputNumber
          min={1}
          max={Object.keys(user.data.ascension.levels.levels).length}
          defaultValue={ascension}
          onChange={(level) => setAscension(level ?? 1)}
        />
        <CharacterComponent
          character={user}
          ascension={ascension}
          level={level}
        />
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
  },
});

export default Characters;
