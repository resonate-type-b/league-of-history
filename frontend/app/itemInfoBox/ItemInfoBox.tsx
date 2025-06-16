import Markdown from "react-markdown";
import { Icon } from "~/Icon";
import type { LeagueItem } from "../leagueItem";
import { FormatMotd, ItemLine } from "./_common";
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
    if (
      statName in itemMap &&
      !["gold_cost"].includes(statName) &&
      !statName.startsWith("unique_passive")
    ) {
      const [descriptor, value] = formatStat(item, statName as keyof FormatterMap);
      statJSXList.push(<ItemLine descriptor={descriptor} value={value} key={statName} />);
    }
  }

  // now we check if there is any passive/motd to show
  const textJSXList: React.JSX.Element[] = [];

  for (const i of [1, 2, 3, 4]) {
    const passive = `unique_passive_${i}` as keyof LeagueItem;
    const passiveName = `unique_passive_${i}_name` as keyof LeagueItem;

    if (item[passive] !== undefined) {
      const formattedPassive = item[passive];
      const formattedName = item[passiveName] !== undefined ? item[passiveName] : "Passive";

      textJSXList.push(
        <div key={"passive" + i} className="pb-2">
          <div className="font-bold text-sm text-slate-400">
            <Markdown>{`${formattedName}`}</Markdown>
          </div>
          <div className="text-sm ml-10">
            <Markdown
              components={{
                p: ({ children, ...props }) => {
                  return (
                    <p className="pb-2" {...props}>
                      {children}
                    </p>
                  );
                },
              }}>{`${formattedPassive}`}</Markdown>
          </div>
        </div>
      );
    }
  }

  return (
    <div className={`border-t border-blue-200 pt-5 pb-14 pl-3 pr-8 sm:pr-3 ${className}`}>
      <div className="flex flex-row">
        <div className="flex-grow"> {statJSXList}</div>
        <Icon item={item} />
      </div>
      <hr className="pb-3 invisible" />
      {textJSXList}
      {item["motd"] !== undefined && <FormatMotd motd={item.motd} />}
    </div>
  );
}
