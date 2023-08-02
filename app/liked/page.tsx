import getLikedSongs from "@/actions/getLikedSongs";
import Header from "@/components/Header";
import Image from "next/image";
import LikedContent from "./components/LikedContent";

export const revalidate = 0; //* This means this page will not be cached and data always only be up to date

const Liked = async () => {
  const songs = await getLikedSongs();

  return (
    <div className="h-full w-full overflow-hidden overflow-y-auto rounded-lg bg-neutral-900 ">
      <Header>
        <div className="mt-20">
          <div className="flex flex-col items-center gap-x-5 md:flex-row">
            <div className="relative h-32 w-32 lg:h-44 lg:w-44">
              <Image
                fill
                src="/images/liked.png"
                alt="Playlist"
                className="object-cover"
              />
            </div>
            <div className="mt-4 flex flex-col gap-y-2 md:mt-0">
              <p className="hidden text-sm font-semibold md:block">Playlist</p>
              <h1 className="text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
                Liked Songs
              </h1>
            </div>
          </div>
        </div>
      </Header>
      <LikedContent songs={songs} />
    </div>
  );
};

export default Liked;
