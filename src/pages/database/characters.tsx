import React, { useState } from "react";
import { InferGetStaticPropsType } from "next";
import { fetchAvatars } from "@/api/database/avatar/character";
import { Button, Card, Col, InputNumber, Row, Select, Space, Typography } from "antd";
import { CharacterCard, characters } from "@/assets/database/characters";
import {
  calculateAvatarStat,
  getAscensionSpecialStats,
  getElement,
  getMaxAscension,
} from "@/util/avatar";
import { HeartFilled, StarFilled } from "@ant-design/icons";
import { CurvePropertyType, StatType } from "@/types/database";
import _ from "lodash";
import {
  GiBroadsword,
  GiFairyWand,
  GiPowerLightning,
  GiRoundStar,
  GiRun,
  GiShield,
  GiSparkSpirit,
  GiSwordWound,
} from "react-icons/gi";
import { formatMap, propertyMap, statMap } from "@/util/mappings";
import Seo from "@/components/seo";

type CharacterCardProps = {
  character: CharacterCard;
  level: number;
  ascension: number;
};

type ElementProps = {
  type: StatType | CurvePropertyType | string;
  icon: JSX.Element;
  value: number;
  bonus?: number;
};

const elements: {
  type: StatType;
  icon: JSX.Element;
  base?: number;
}[] = [
  {
    type: "HP",
    icon: <HeartFilled />,
  },
  {
    type: "ATTACK",
    icon: <GiBroadsword />,
  },
  {
    type: "DEFENCE",
    icon: <GiShield />,
  },
  {
    type: "ELEMENTAL_MASTERY",
    icon: <GiFairyWand />,
  },
  {
    type: "CRITICAL_RATE",
    base: 0.05,
    icon: <GiSparkSpirit />,
  },
  {
    type: "CRITICAL_DAMAGE",
    base: 0.5,
    icon: <GiSwordWound />,
  },
  {
    type: "STAMINA",
    base: 75,
    icon: <GiRun />,
  },
  {
    type: "ENERGY_RECHARGE",
    base: 1,
    icon: <GiPowerLightning />,
  },
];

const CharacterElementComponent = ({ icon, type, value, bonus }: ElementProps) => {
  const data = statMap[type] ?? propertyMap[type];
  return (
    <>
      <Space align="center" className="vertical-align">
        {icon}
        <Typography.Text>{data?.name ?? type}</Typography.Text>
      </Space>
      <Typography.Text style={{ float: "right" }}>
        {formatMap[data?.format]?.(value) ?? value}
        {bonus && (
          <Typography.Text style={{ color: "green" }}>
            {" "}
            + {formatMap[data?.format]?.(value) ?? value}
          </Typography.Text>
        )}
      </Typography.Text>
    </>
  );
};

const CharacterComponent = ({ character, level, ascension }: CharacterCardProps) => {
  const special = _.keyBy(
    getAscensionSpecialStats(
      character.data.ascension.levels.ascensions[
        Math.min(getMaxAscension(character.data.ascension.levels), ascension)
      ],
    ),
    "type",
  );

  return (
    <div>
      <Seo title="Characters" />
      <Row gutter={[8, 0]} wrap={false}>
        <Col span={6}>
          <Card cover={<img alt="" src={character.assets.card} />}>
            <Card.Meta
              title={`${character.data.name} (${getElement(character.data) ?? "???"})`}
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
            <Row gutter={6}>
              {elements.map((element) => {
                const property = statMap[element.type]?.property ?? "";
                const bonus = special[property]?.value;
                const stat =
                  calculateAvatarStat(character.data, element.type, level, ascension) +
                  (element.base ?? 0);

                if (bonus) delete special[property];
                return (
                  <Col span={6} key={element.type}>
                    <CharacterElementComponent {...element} value={stat} bonus={bonus} />
                  </Col>
                );
              })}
              {Object.values(special).map((stat) => (
                <Col span={6} key={stat.type}>
                  <CharacterElementComponent
                    type={stat.type}
                    icon={<GiRoundStar />}
                    value={stat.value}
                  />
                </Col>
              ))}
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

const Characters = ({ characters: chars }: InferGetStaticPropsType<typeof getStaticProps>) => {
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
              disabled={
                ascension?.rewards.unlockLevel !== level ||
                ascension.level == getMaxAscension(user.data.ascension.levels)
              }
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
          (ascended || (ascension && ascension?.rewards.unlockLevel !== level) ? 1 : 0)
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
