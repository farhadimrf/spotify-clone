"use client";

import useLoadImage from "@/hooks/useLoadImage";
import { Song } from "@/types";
import Image from "next/image";

interface MediaItemProps {
  data: Song;
  onClick?: (id: string) => void;
}
const MediaItem: React.FC<MediaItemProps> = ({ data, onClick }) => {



  const imageUrl = useLoadImage(data);


  const handleClick = () => {
    if (onClick) return onClick(data.id);

    // TODO: Default turn  on player
  };

  return (
    <div
      onClick={handleClick}
      className="items-canter flex w-full cursor-pointer gap-x-3 rounded-md p-2 hover:bg-neutral-800/50"
    >
      <div className="min-w-[48px] relative min-h-[48px] overflow-hidden rounded-md">
        <Image
          fill
          src={imageUrl || "/images/liked.png"}
          alt="Media Item"
          className="object-cover"
        />
      </div>
      <div className="flex flex-col gap-y-1 overflow-hidden">
        <p className="truncate text-white">{data.title}</p>
        <p className="truncate text-sm text-neutral-400">{data.author}</p>
      </div>
    </div>
  );
};

export default MediaItem;
