import { Icon } from "~/Icon";
import type { LeagueItem } from "../leagueItem";
import { ItemLine, Motd, PassiveLine } from "./_common";
import { itemMap, type FormatterMap } from "./itemFormatMap";

function formatStat<K extends keyof FormatterMap>(item: LeagueItem, statName: K) {
  const formatter = itemMap[statName];
  return formatter(item[statName]!);
}

export type ItemInfoBoxProps = {
  item: LeagueItem;
  className?: string;
};

export function ItemInfoBox({ item, className = "" }: ItemInfoBoxProps) {
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
    if (statName in itemMap && !["gold_cost"].includes(statName)) {
      const [descriptor, value] = formatStat(item, statName as keyof FormatterMap);
      statJSXList.push(<ItemLine descriptor={descriptor} value={value} key={statName} />);
    }
  }

  // now we check if there is any passive/motd to show
  const textJSXList: React.JSX.Element[] = [];

  for (const i of [1, 2, 3, 4]) {
    const passive = item[`passive_${i}` as keyof LeagueItem] as string | undefined;
    const passiveName = item[`passive_${i}_name` as keyof LeagueItem] ?? ("Passive" as string);

    if (passive !== undefined) {
      textJSXList.push(<PassiveLine key={`passive_${i}`} heading={passiveName} body={passive} />);
    }
  }
  if (item.buy_group !== undefined) {
    textJSXList.push(
      <PassiveLine
        key={"buyGroup"}
        heading={"Limitation"}
        body={`Limited to 1 ${item.buy_group.join("/")}`}
        className="italic"
      />
    );
  }

  return (
    <div className={`border-t border-blue-200 pt-5 pb-14 pl-3 pr-8 sm:pr-3 ${className}`}>
      <div className="flex flex-row">
        <div className="flex-grow"> {statJSXList}</div>
        <Icon item={item} />
      </div>
      <hr className="pb-3 invisible" />
      {textJSXList}
      {item["motd"] !== undefined && <Motd motd={item.motd} />}
    </div>
  );
}
