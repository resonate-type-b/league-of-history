import useFavicon from "~/useFavicon";

export default function Home() {
  useFavicon("/favicon.ico");
  // TODO: get all the available patch versions from backend and provide as Context to all components
  return (
    <>
      <title>resonate lair</title>
      <img
        src="/banner.gif"
        alt="UX Design is my Passion"
        className="m-auto w-2/3 md:w-1/2 min-w-72 py-20"></img>
      <h2 className="text-justify md:text-xl 2xl:text-2xl p-10 xl:text-center font-mono">
        If you are a potential employer, please ignore this landing page and click below to view my
        work.
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 2xl:max-w-[96rem] mx-auto px-3 text-xs lg:text-sm 2xl:text-base">
        <BigButton link="/patch/">
          <img src="/nerdge.png" className="w-full" alt="nerd Ezreal"></img>
          League of Items History
        </BigButton>
        <BigButton link="/mondstadt/">
          <img src="/mondstadt.webp" className="w-full" alt="paimon"></img>
          Peaceful Mondstadt
        </BigButton>
      </div>
    </>
  );
}

function BigButton({ link, children }: { link: string; children: React.ReactNode }) {
  return (
    <a
      onClick={() => (window.location.href = link)}
      className=" block mx-auto md:ml-5 p-5 text-lg text-center w-64 h-72 cursor-pointer hover:bg-gray-700 active:bg-gray-700 transition">
      {children}
    </a>
  );
}
