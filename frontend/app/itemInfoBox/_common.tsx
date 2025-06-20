import type { Change } from "diff";
import Markdown from "react-markdown";
import type { LeagueItem } from "~/leagueItem";

type ItemLineProps = {
  descriptor: string | null;
  value: React.JSX.Element | null;
  className?: string | null;
};

export function ItemLine({ descriptor, value, className = null }: ItemLineProps) {
  if (descriptor === null && value === null) {
    return <></>;
  }
  return (
    <div className={`${className} flex flex-row flex-nowrap px-5 md:px-10`}>
      <div className="flex-grow">{`${descriptor}`}</div>
      <div className="min-w-10 w-fit">{value}</div>
    </div>
  );
}

export function Motd({ motd, highlight = false }: { motd: string; highlight?: boolean }) {
  const firstWord = motd.split(" ")[0];
  return (
    <div key="motd" className={highlight ? "pb-2 bg-cyan-900" : "pb-2"}>
      <div className="font-bold text-sm text-cyan-400">{firstWord}</div>
      <div className="text-sm ml-10 text-cyan-100">
        <Markdown>{motd.slice(firstWord.length)}</Markdown>
      </div>
    </div>
  );
}

// if changeObj is a string -> the stat wasn't changed. Return it back as is in a span
// if its a change object -> return back a list of spans that have the correct styling
export function diffText(changeObj: Change[] | string): React.JSX.Element[] {
  if (typeof changeObj === "string") {
    return [
      <Markdown
        key={changeObj}
        components={{
          p: ({ children }) => <span className="pb-1">{children}</span>,
        }}>
        {changeObj}
      </Markdown>,
    ];
  }

  const JSXList = [];
  let i = 0;
  for (const part of changeObj) {
    const classes = part.added
      ? "bg-green-800/50 text-green-200 px-1"
      : part.removed
      ? "bg-red-800/50 text-red-200 px-1 line-through"
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

type PassiveLineProps = {
  heading: LeagueItem[keyof LeagueItem] | Change[];
  body: LeagueItem[keyof LeagueItem] | Change[];
  className?: string;
};

// if passed body is a change object, give it to diffText. Otherwise, parse it as Markdown directly.
export function PassiveLine({
  heading,
  body,
  className = "",
}: PassiveLineProps): React.JSX.Element {
  // object means Change[], else must be string
  const fmtHeading =
    typeof heading === "object" ? diffText(heading as Change[]) : (heading as string);
  const fmtBody =
    typeof body === "object" ? (
      diffText(body as Change[])
    ) : (
      <Markdown
        components={{
          p: ({ children, ...props }) => {
            return (
              <p className="pb-2" {...props}>
                {children}
              </p>
            );
          },
        }}>
        {`${body}`}
      </Markdown>
    );
  return (
    <div className={`pb-2 ${className}`}>
      <div className="font-bold text-sm text-slate-400">{fmtHeading}</div>
      <div className="text-sm ml-10 pb-2">{fmtBody}</div>
    </div>
  );
}
