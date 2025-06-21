import { Icon } from "~/Icon";
import type { DiffLeagueItem } from "../leagueItem";
import { ItemLine, Motd, PassiveLine, diffText } from "./_common";
import { itemMap, type FormatterMap } from "./itemFormatMap";

function formatStat<K extends keyof FormatterMap>(
  item: DiffLeagueItem,
  statName: K
): [string, React.JSX.Element] {
  const formatter = itemMap[statName];
  const diff = diffText(item[statName]!);
  return formatter(diff);
}

export type ItemDiffBoxProps = {
  item: DiffLeagueItem;
  className?: string;
};

/*
  the statJSXList part is identical to ItemInfoBox, but uses DiffLeagueItem instead of LeagueItem,
  which means if I want to abstract it, TypeScript will think I'm basically committing type genocide
  let's just say the code is intentionally separated and not because I don't want to spend 5 hours wrestling type warnings.

  Also, paragraphs aren't displayed properly in this because <Markdown> auto wraps text in <p>, so to display the diffs inline,
  We need to strip <p> tags. The fix is that riot needs to stop releasing items that need paragraphs of text.
  // TODO: Maybe add a custom parser to handle \n\n in the string? Would allow us to use that notation to manually add paragraphs.
*/
export function ItemDiffBox({ item, className = "" }: ItemDiffBoxProps): React.JSX.Element {
  const statJSXList: React.JSX.Element[] = [];

  // this is a little bit hacky...
  // but basically, if an item's gold cost is -1 (quest reward),
  // hijack it here manually pass -1 to the formatter so it can catch it
  // because otherwise, formatStat does diffWord() to it at which point it's wrapped in <span> and impossible to work with
  const [gold_cost_desc, gold_cost_value] =
    item.gold_cost === "-1" ? itemMap["gold_cost"](-1) : formatStat(item, "gold_cost");
  statJSXList.push(
    <ItemLine
      descriptor={gold_cost_desc}
      value={gold_cost_value}
      key="gold_cost"
      className="text-yellow-300"
    />
  );

  for (const statName of Object.keys(item) as (keyof DiffLeagueItem)[]) {
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
    const passive = `passive_${i}` as keyof DiffLeagueItem;
    const passiveName = `passive_${i}_name` as keyof DiffLeagueItem;

    if (item[passive] !== undefined) {
      textJSXList.push(
        <PassiveLine
          key={"passive" + i}
          heading={item[passiveName] ?? "Passive"}
          body={item[passive]}
        />
      );
    }
  }

  if (item.buy_group !== undefined) {
    textJSXList.push(<PassiveLine key={"buyGroup"} heading={"Limitation"} body={item.buy_group} />);
  }

  return (
    <div className={`border-t border-blue-200 pt-5 pb-14 pl-3 pr-8 sm:pr-3 ${className}`}>
      <div className="flex flex-row">
        <div className="flex-grow"> {statJSXList}</div>
        <Icon
          item={item}
          className={typeof item.icon_version === "object" ? "border-yellow-200" : ""}
        />
      </div>
      <hr className="pb-3 invisible" />
      {textJSXList}
      {item["motd"] !== undefined && <Motd motd={item.motd} highlight={true} />}
    </div>
  );
}
