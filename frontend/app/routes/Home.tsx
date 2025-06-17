import useFavicon from "~/useFavicon";

export default function Home() {
  useFavicon("/favicon.ico");
  // TODO: get all the available patch versions from backend and provide as Context to all components
  return (
    <>
      <title>resonate.moe</title>
      <div className="md:max-w-11/12 mx-auto py-10 px-5 flex flex-row items-center">
        <div className="text-right font-medium w-1/2 text-l pr-2 sm:text-4xl md:text-4xl lg:text-5xl xl:text-6xl">
          Reject Modernism
        </div>
        <div className="flex-shrink w-48 sm:w-1/2">
          <img src="embrace.gif" alt="Embrace WordArt"></img>
        </div>
      </div>
      <img
        src="/banner1.gif"
        alt="Flame text never stopped being cool"
        className="m-auto w-2/3 md:w-1/2 min-w-72 pb-5"></img>
      <img
        src="/banner2.png"
        alt="DON'T LET THEM STEAL THIS FROM YOU"
        className="m-auto w-2/3 md:w-1/2 min-w-72 pb-24"></img>

      <h1 className="text-justify md:text-xl 2xl:text-2xl p-10 xl:text-center font-mono">
        <p className="pb-2">
          If you are a potential employer, please ignore this landing page and click below to view
          my work.
        </p>
        <p>If you're not, then please feel free to view this landing page. And also my work.</p>
      </h1>
      <div
        className="mx-auto md:ml-5 p-5 text-lg text-center w-64 h-72 cursor-pointer hover:bg-gray-700 hover:transition"
        onClick={() => (window.location.href = "/patch/")}>
        <img src="/nerdge.png" className="w-full" alt="nerd Ezreal"></img>
        League of Items History
      </div>
    </>
  );
}
