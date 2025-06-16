import useFavicon from "~/useFavicon";

export default function Home() {
  useFavicon("/favicon.ico");
  // TODO: get all the available patch versions from backend and provide as Context to all components
  return (
    <>
      <title>resonate.moe</title>
      <div className="text-center p-10 text-5xl">Welcome to my wwebsite as on the internet</div>
      <img
        src="/flames.gif"
        alt="resonate is spelt as resonate! Not Resonate"
        className="m-auto w-1/2 min-w-80 pb-32"></img>
      <div
        className="mx-auto md:ml-5 p-5 text-lg text-center w-64 h-72 cursor-pointer hover:bg-gray-700 hover:transition"
        onClick={() => (window.location.href = "/patch/")}>
        <img src="/nerdge.png" className="w-full" alt="nerd Ezreal"></img>
        League of Items History
      </div>
    </>
  );
}
