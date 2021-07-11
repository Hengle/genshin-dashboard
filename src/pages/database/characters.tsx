import React, { useState } from "react";
import { InferGetStaticPropsType } from "next";
import { fetchAvatars } from "@/api/database/avatar/character";
import { Card, Col, Row, Select, Space, Typography } from "antd";
import { CharacterCard, characters as db } from "@/assets/database/characters";
import {
  calculateAvatarStat,
  calculateWeaponStat,
  getAscensionSpecialStats,
  getElement,
  getMaxAscension,
} from "@/util/avatar";
import { HeartFilled, StarFilled } from "@ant-design/icons";
import { CurvePropertyType, StatType, WeaponData } from "@/types/database";
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
import LevelSelector from "@/components/levels";
import { fetchWeapons } from "@/api/database/weapon/weapon";

type CharacterCardProps = {
  character: CharacterCard;
  level: number;
  ascension: number;
  weapons: WeaponData[];
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
            + {formatMap[data?.format]?.(bonus) ?? bonus}
          </Typography.Text>
        )}
      </Typography.Text>
    </>
  );
};

const CharacterComponent = ({
  character,
  level,
  ascension,
  weapons: baseWeapons,
}: CharacterCardProps) => {
  const weapons = baseWeapons.filter((weapon) => weapon.type === character.data.weaponType);

  const [selection, setSelection] = useState(weapons[0].name);
  const [stats, setStats] = useState({ level: 1, ascension: 0 });

  const weapon = weapons.find((data) => data.name === selection) ?? weapons[0];
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
                  {Array.from(Array(character.data.stars), (_, i) => (
                    <StarFilled key={i} style={{ color: "gold" }} />
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
                  calculateWeaponStat(weapon, element.type, stats.level, stats.ascension) +
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
          <Card>
            <Card.Meta title="Weapon" />
            <Select
              defaultValue={selection}
              style={{ width: 120 }}
              showSearch={true}
              onChange={(query) => setSelection(query)}
            >
              {Object.entries(
                _.chain(weapons)
                  .groupBy((data) => data.stars)
                  .value(),
              )
                .reverse()
                .map(([key, weapons]) => (
                  <Select.OptGroup key={`${key} Star`}>
                    {weapons.map((weapon) => (
                      <Select.Option value={weapon.name} key={weapon.id}>
                        {weapon.name}
                      </Select.Option>
                    ))}
                  </Select.OptGroup>
                ))}
            </Select>
            <LevelSelector ascensions={weapon.ascensions} stats={[stats, setStats]} />
            <Row gutter={6}>
              {elements.map((element) => {
                const stat =
                  calculateWeaponStat(weapon, element.type, stats.level, stats.ascension) +
                  (element.base ?? 0);

                return (
                  <Col span={6} key={element.type}>
                    <CharacterElementComponent {...element} value={stat} />
                  </Col>
                );
              })}
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

const Characters = ({ characters, weapons }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const [selection, setSelection] = useState(characters[0].name);
  const [stats, setStats] = useState({ level: 1, ascension: 0 });

  const character = characters.find((character) => character.name === selection) ?? characters[0];
  const card = db[selection.toLowerCase()]?.(character) ?? {
    data: character,
    assets: {},
  };

  return (
    <div>
      <Typography.Title level={3}>Database: Characters</Typography.Title>
      <Card>
        <Card.Meta title="Controls" />
        <Space direction="vertical">
          <LevelSelector stats={[stats, setStats]} ascensions={card.data.ascension.levels} />
          <Space>
            <Typography.Text>Character</Typography.Text>
            <Select
              defaultValue={selection}
              style={{ width: 120 }}
              showSearch={true}
              onChange={(query) => setSelection(query)}
            >
              {Object.entries(
                _.chain(characters)
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
        character={card}
        weapons={weapons}
        ascension={stats.ascension}
        level={stats.level}
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
    weapons: Object.values(await fetchWeapons()),
  },
});

export default Characters;
