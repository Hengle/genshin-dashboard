import React, { useState } from "react";
import { InferGetStaticPropsType } from "next";
import { fetchAvatars } from "@/api/database/avatar/character";
import {
  Button,
  Card,
  Col,
  InputNumber,
  Row,
  Select,
  Space,
  Typography,
} from "antd";
import { CharacterCard, characters } from "@/assets/database/characters";
import { calculateAvatarStat, getElement } from "@/util/avatar";
import { StarFilled } from "@ant-design/icons";
import { StatType } from "@/types/database";
import _ from "lodash";

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
    <Row gutter={[8, 0]}>
      <Col span={6}>
        <Card cover={<img alt="" src={character.assets.card} />}>
          <Card.Meta
            title={`${character.data.name} (${
              getElement(character.data) ?? "???"
            })`}
            description={
              <>
                {Array.from(Array(character.data.stars), (v) => (
                  <StarFilled key={v} style={{ color: "gold" }} />
                ))}
              </>
            }
          />
        </Card>
      </Col>
      <Col flex="auto">
        <Card>
          <Card.Meta title="Base Stats" />
          <Row>
            {(["HP", "ATTACK", "DEFENCE", "STAMINA"] as StatType[]).map((v) => (
              <Col span={4} key={v}>
                <Typography.Text>
                  {/* TODO: Add stat calculation for weapons */}
                  {v}:{" "}
                  {calculateAvatarStat(character.data, v, level, ascension)}
                </Typography.Text>
              </Col>
            ))}
          </Row>
        </Card>
      </Col>
    </Row>
  </div>
);

const Characters = ({
  characters: chars,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const [character, setCharacter] = useState(chars[0].name);
  const entry = chars.find((v) => v.name === character) ?? chars[0];
  const user = characters[character.toLowerCase()]?.(entry) ?? {
    data: entry,
    assets: {},
  };

  const [level, setLevel] = useState(1);
  const [ascended, setAscended] = useState(false);
  const ascension = _.last(
    Object.values(user.data.ascension.levels.ascensions).filter(
      (value) => value.rewards.unlockLevel <= level,
    ),
  );

  return (
    <div>
      <Typography.Title level={3}>Database: Characters</Typography.Title>
      <Card>
        <Card.Meta title="Controls" />
        <Space direction="vertical">
          <Space>
            <Typography.Text>Level</Typography.Text>
            <InputNumber
              min={1}
              max={90}
              defaultValue={level}
              onChange={(level) => setLevel(level ?? 1)}
            />
            <Button
              onClick={() => setAscended(!ascended)}
              type={ascended ? "primary" : "default"}
              disabled={ascension?.rewards.unlockLevel !== level}
            >
              Ascended
            </Button>
          </Space>
          <Space>
            <Typography.Text>Character</Typography.Text>
            <Select
              defaultValue={chars[0].name}
              style={{ width: 120 }}
              showSearch={true}
              onChange={(v: string) => setCharacter(v)}
            >
              {Object.entries(
                _.chain(chars)
                  .uniqBy("name")
                  .groupBy((data) => getElement(data) ?? "Other")
                  .value(),
              ).map(([key, characters]) => (
                <Select.OptGroup key={key}>
                  {characters.map((character) => (
                    <Select.Option value={character.name} key={character.id}>
                      {character.name}
                    </Select.Option>
                  ))}
                </Select.OptGroup>
              ))}
            </Select>
          </Space>
        </Space>
      </Card>
      <br />
      <CharacterComponent
        character={user}
        ascension={
          (ascension?.level ?? 0) +
          (ascended || (ascension && ascension?.rewards.unlockLevel !== level)
            ? 1
            : 0)
        }
        level={level}
      />
    </div>
  );
};

export const getStaticProps = async () => ({
  props: {
    characters: Object.values(await fetchAvatars())
      .filter((v) => v.name.length > 0)
      .map((v) => ({
        ...v,
        key: v.id,
      })),
  },
});

export default Characters;
