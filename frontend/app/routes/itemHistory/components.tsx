import { useState } from "react";
import type { ItemDiffBoxProps } from "~/itemInfoBox/ItemDiffBox";
import type { DiffLeagueItem, LeagueItem } from "~/leagueItem";
import type { ItemInfoBoxProps } from "../../itemInfoBox/ItemInfoBox";

// generates a clickable, expandable heading of the patches in the patchList
export function ExpandablePatchList({ patchList }: { patchList: string[] }) {
  const [expand, setExpand] = useState(false);
  const anchorJSXList: React.JSX.Element[] = [];
  for (let i = 0; i < patchList.length; i++) {
    const text = i === patchList.length - 1 ? patchList[i] : `${patchList[i]}`;
    anchorJSXList.push(
      <a
        className="hover:text-blue-200 hover:underline active:text-blue-200 active:underline transition"
        href={`/patch/?patch_version=${patchList[i]}`}>
        {text}
      </a>
    );
  }
  anchorJSXList.reverse();
  const first = anchorJSXList[0];
  const last = anchorJSXList[anchorJSXList.length - 1];
  return !expand ? (
    <div className="flex flex-row items-end font-medium text-blue-300">
      <span className="text-2xl flex-grow">
        {first}
        {anchorJSXList.length >= 2 && " – "}
        {anchorJSXList.length >= 2 && last}
      </span>
      {anchorJSXList.length >= 3 && (
        <a
          onClick={() => setExpand(true)}
          className="text-md hover:text-blue-200 hover:underline active:text-blue-200 active:underline transition">
          {" expand all..."}
        </a>
      )}
    </div>
  ) : (
    <div className="flex flex-row items-end font-medium text-blue-300">
      <span className="flex-grow text-lg">
        {anchorJSXList.map((link, i) => (
          <span key={i}>{link}; </span>
        ))}
      </span>

      {
        <a
          onClick={() => setExpand(false)}
          className="text-md hover:text-blue-200 hover:underline active:text-blue-200 active:underline transition">
          {" collapse..."}
        </a>
      }
    </div>
  );
}

type InfoBoxSwitcherProps = {
  infoBox: ({ item, className }: ItemInfoBoxProps) => React.JSX.Element;
  diffBox: ({ item, className }: ItemDiffBoxProps) => React.JSX.Element;
  infoItem: LeagueItem;
  diffItem: DiffLeagueItem;
};

export function InfoBoxSwitcher({ infoBox, diffBox, infoItem, diffItem }: InfoBoxSwitcherProps) {
  const [showDiff, setShowDiff] = useState(false);
  return (
    <button
      onClick={() => setShowDiff((x) => !x)}
      className="cursor-pointer relative w-full text-left hover:bg-gray-800 active:bg-gray-800 transition">
      {infoBox({ item: infoItem, className: showDiff ? "blur-sm brightness-50" : "" })}
      {showDiff &&
        diffBox({ item: diffItem, className: "absolute w-full top-0 bg-gray-900 z-999" })}
    </button>
  );
}

export function SubHeader({
  children,
  marginBottom = true,
}: {
  children: React.ReactNode;
  marginBottom?: boolean;
}) {
  return (
    <div
      className={
        "text-3xl text-center font-medium bg-blue-950 border-gray-400" +
        (marginBottom ? " mb-10 border-b-1" : " border-y-1")
      }>
      {children}
    </div>
  );
}
