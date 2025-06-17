import { type Change } from "diff";
import Markdown from "react-markdown";
import { Icon } from "~/Icon";
import type { DiffLeagueItem } from "../leagueItem";
import { FormatMotd, ItemLine } from "./_common";
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
export function ItemDiffBox({ item, className = "" }: ItemDiffBoxProps) {
  const statJSXList: React.JSX.Element[] = [];

  // we want to make sure gold cost is always on top
  if (item.gold_cost === "-1") {
    // this is extremely extremely hacky...
    // but basically, if an item's gold cost is -1 (quest reward),
    // hijack it here manually pass -1 to the formatter so it can catch it
    // because otherwise, the next step is to diffWord() it at which point it's wrapped in <span> and impossible to work with
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
      const passive = `unique_passive_${i}` as keyof DiffLeagueItem;
      const passiveName = `unique_passive_${i}_name` as keyof DiffLeagueItem;

      if (item[passive] !== undefined) {
        const formattedPassive = item[passive] as Change[];
        const formattedName =
          item[passiveName] !== undefined ? (item[passiveName] as Change[]) : "Passive";

        textJSXList.push(
          <div key={"passive" + i} className="pb-2">
            <div className="font-bold text-sm text-slate-400">{diffText(formattedName)}</div>
            <div className="text-sm ml-10 pb-2">{diffText(formattedPassive)}</div>
          </div>
        );
      }
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
        {item["motd"] !== undefined && <FormatMotd motd={item.motd} highlight={true} />}
      </div>
    );
  }
}

// if changeObj is a string -> the stat wasn't changed. Return it back as is in a span
// if its a change object -> return back a list of spans that have the correct styling
function diffText(changeObj: Change[] | string): React.JSX.Element[] {
  if (typeof changeObj === "string") {
    return [
      <span key={changeObj}>
        <Markdown
          components={{
            p: ({ children }) => <>{children}</>, // strip <p>
          }}>
          {changeObj}
        </Markdown>
      </span>,
    ];
  }

  const JSXList = [];
  let i = 0;
  for (const part of changeObj) {
    const classes = part.added
      ? "bg-green-700/40 text-green-200 px-1"
      : part.removed
      ? "bg-red-700/40 text-red-200 px-1"
      : "";
    // returns span instead of p like everywhere else, because otherwise each diff part will be newline'd
    // we strip <p> tags because markdown behaviour means it considers all text to be paragraphs and wraps <p>
    // unfortunately this means we completely lose the ability to parse markdown paragraphs
    JSXList.push(
      <span className={classes} key={`count_${i++}`}>
        <Markdown
          components={{
            p: ({ children }) => <>{children}</>, // strip <p>
          }}>
          {part.value}
        </Markdown>
      </span>
    );
  }
  return JSXList;
}
