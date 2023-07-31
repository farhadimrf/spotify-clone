"use client";
import { FaPlay } from "react-icons/fa";

import Image from "next/image";
import { useRouter } from "next/navigation";

interface ListItemsProps {
  name: string;
  image: string;
  href: string;
}
const ListItems: React.FC<ListItemsProps> = ({ name, image, href }) => {
  const router = useRouter();

  const onClick = () => {
    // Add authentication before push
    router.push(href);
  };
  return (
    <button
      onClick={onClick}
      className="group relative flex items-center gap-x-4 overflow-hidden rounded-md  bg-neutral-100/10 pr-4 transition hover:bg-neutral-100/20"
    >
      <div className="relative min-h-[64px] min-w-[64px]">
        <Image fill className="object-cover " alt="Image" src={image} />
      </div>
      <p className="truncate py-5 font-medium">{name}</p>
      <div className="absolute right-5 flex items-center justify-center rounded-full bg-green-500 p-4 opacity-0 drop-shadow-md transition hover:scale-110 group-hover:opacity-100">
        <FaPlay className="text-black" />
      </div>
    </button>
  );
};

export default ListItems;
