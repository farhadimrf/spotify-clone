import getSongs from "@/actions/getSongs";
import Header from "@/components/Header";
import ListItems from "@/components/ListItems";
import PageContent from "./components/PageContent";

export const revalidate = 0; //* This means this page will not be cached and data always only be up to date

export default async function Home() {
  const songs = await getSongs();
  return (
    <div className="h-full w-full  overflow-hidden overflow-y-auto rounded-lg bg-neutral-900">
      <Header>
        <div className="mb-2">
          <h1 className="text-3xl font-semibold text-white ">Welcome back</h1>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            <ListItems
              image="/images/liked.png"
              name="Liked Songs"
              href="liked"
            />
          </div>
        </div>
      </Header>
      <div className="mb-7 mt-2  px-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-white">Newest Song</h1>
        </div>
        <div>
          <PageContent songs={songs} />
        </div>
      </div>
    </div>
  );
}
