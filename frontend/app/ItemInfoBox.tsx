import type { FormatterMap, LeagueItem } from "./types";

const itemMap: FormatterMap = {
  item_id: (value) => ["Item ID: ", `${value}`],
  patch_version: (value) => ["Patch: ", `${value}`],
  item_name: (value) => ["Name: ", `${value}`],
  gold_cost: (value) => ["Gold Cost: ", `${value}`],
  hp: (value) => ["Health: ", `${value}`],
  hp5: (value) => ["HP Regen per 5: ", `${value}`],
  armor: (value) => ["Armor: ", `${value}`],
  magic_resist: (value) => ["Magic Resist: ", `${value}`],
  tenacity: (value) => ["Tenacity: ", `${value}%`],
  slow_resist: (value) => ["Slow Resist: ", `${value}%`],
  aspd: (value) => ["Attack Speed: ", `${value}%`],
  ad: (value) => ["Attack Damage: ", `${value}`],
  ap: (value) => ["Ability Power: ", `${value}`],
  crit_chance: (value) => ["Critical Strike Chance: ", `${value}%`],
  armor_pen_flat: (value) => ["Armor Penetration: ", `${value}`],
  lethality: (value) => ["Lethality: ", `${value}`],
  armor_pen_percent: (value) => ["Armor Penetration: ", `${value}%`],
  magic_pen_flat: (value) => ["Magic Penetration: ", `${value}`],
  magic_pen_percent: (value) => ["Magic Penetration: ", `${value}%`],
  lifesteal: (value) => ["Lifesteal: ", `${value}%`],
  physical_vamp: (value) => ["Physical Vamp: ", `${value}%`],
  magic_vamp: (value) => ["Magic Vamp: ", `${value}%`],
  omnivamp: (value) => ["Omnivamp: ", `${value}%`],
  cdr: (value) => ["Cooldown Reduction: ", `${value}%`],
  haste: (value) => ["Ability Haste: ", `${value}`],
  mp: (value) => ["Mana: ", `${value}`],
  mp5: (value) => ["Mana Regen per 5: ", `${value}`],
  movespeed_flat: (value) => ["Move Speed: ", `${value}`],
  movespeed_percent: (value) => ["Move Speed: ", `${value}%`],
  gp10: (value) => ["Gold per 10: ", `${value}`],
} as const;

function formatStat<K extends keyof FormatterMap>(item: LeagueItem, statName: K) {
  // apparently the fact that LeagueItem and FormatterMap have the same keys is too difficult for the type checker to grasp
  // despite one being a mapping of the other, so we have to tell it manually
  // I assume this is not a good way to do it but I can't figure out another way...
  const formatter = itemMap[statName] as (value: LeagueItem[K]) => [string, string];
  return formatter(item[statName]);
}

type ItemLineProps = {
  descriptor: string;
  value: string;
  className?: string | null;
};

function ItemLine({ descriptor, value, className = null }: ItemLineProps) {
  return (
    <div className={`${className} flex flex-row flex-nowrap px-5 md:px-10`}>
      <p className="flex-grow">{`${descriptor}`}</p>
      <p className="w-10">{`${value}`}</p>
    </div>
  );
}

type ItemInfoBoxProps = {
  item: LeagueItem;
};

export default function ItemInfoBox({ item }: ItemInfoBoxProps) {
  const statJSXList: React.JSX.Element[] = [];

  // we want to make sure gold cost is always on top
  const [gold_cost_desc, gold_cost_value] = formatStat(item, "gold_cost");

  statJSXList.push(
    <ItemLine
      descriptor={gold_cost_desc}
      value={gold_cost_value}
      key="gold_cost"
      className="text-yellow-300"
    />
  );

  for (const statName of Object.keys(item) as (keyof LeagueItem)[]) {
    if (
      !["item_id", "item_name", "patch_version", "gold_cost", "motd"].includes(statName) &&
      !statName.startsWith("unique_passive")
    ) {
      const [descriptor, value] = formatStat(item, statName as keyof FormatterMap);
      statJSXList.push(<ItemLine descriptor={descriptor} value={value} key={statName} />);
    }
  }

  // now we check if there is any passive/motd to show
  const textJSXList: React.JSX.Element[] = [];
  if (item["motd"] != null) {
    const firstWord = item["motd"].split(" ")[0];
    textJSXList.push(
      <>
        <p className="font-bold text-sm text-slate-400">{firstWord}</p>
        <p className="text-sm ml-10">{item["motd"].slice(firstWord.length)}</p>
      </>
    );
  }

  for (const i of [1, 2, 3]) {
    const passive = `unique_passive_${i}` as keyof LeagueItem;
    const passiveName = `unique_passive_${i}_name` as keyof LeagueItem;

    if (item[passive] != null) {
      const formattedPassive = item[passive] as string;
      const formattedName = item[passiveName] != null ? (item[passiveName] as string) : "Passive";

      textJSXList.push(
        <>
          <p className="font-bold text-sm text-slate-400">{`${formattedName}:`}</p>
          <p className="text-sm ml-10">{formattedPassive}</p>
        </>
      );
    }
  }

  return (
    <div className="border-t border-blue-200 pt-3 pb-5 pl-3">
      <a
        href={`/patch/?patch_version=${item.patch_version}`}
        className="text-lg text-blue-300 font-medium hover:font-semibold hover:text-blue-200 hover:underline transition">
        {item.patch_version}
      </a>
      {statJSXList}
      <hr className="pb-3 invisible" />
      {textJSXList}
    </div>
  );
}
