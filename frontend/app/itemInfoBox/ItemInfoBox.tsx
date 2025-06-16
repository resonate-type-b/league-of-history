import Markdown from "react-markdown";
import type { LeagueItem } from "../leagueItem";
import { itemMap, type FormatterMap } from "./itemFormatMap";

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

export function ItemInfoBox({ item }: ItemInfoBoxProps) {
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
      const formattedPassive = item[passive] as string;
      const formattedName = item[passiveName] != null ? (item[passiveName] as string) : "Passive";

      textJSXList.push(
        <div key={"passive" + i} className="pb-2">
          <div className="font-bold text-sm text-slate-400">
            <Markdown>{`${formattedName}:`}</Markdown>
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
  if (item["motd"] !== undefined) {
    const firstWord = item["motd"].split(" ")[0];
    textJSXList.push(
      <div key="motd" className="pb-2">
        <p className="font-bold text-sm text-cyan-400">{firstWord}</p>
        <p className="text-sm ml-10 text-cyan-100">{item["motd"].slice(firstWord.length)}</p>
      </div>
    );
  }

  return (
    <div className="border-t border-blue-200 pt-5 pb-14 pl-3 pr-8 sm:pr-3">
      {statJSXList}
      <hr className="pb-3 invisible" />
      {textJSXList}
    </div>
  );
}
