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
      <p className="flex-grow">{`${descriptor}`}</p>
      <p className="w-10">{value}</p>
    </div>
  );
}

export function FormatMotd({ motd, highlight = false }: { motd: string; highlight?: boolean }) {
  const firstWord = motd.split(" ")[0];
  return (
    <div key="motd" className={highlight ? "pb-2 bg-cyan-900" : "pb-2"}>
      <p className="font-bold text-sm text-cyan-400">{firstWord}</p>
      <p className="text-sm ml-10 text-cyan-100">{motd.slice(firstWord.length)}</p>
    </div>
  );
}
