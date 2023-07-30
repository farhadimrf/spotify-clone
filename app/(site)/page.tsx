import Header from "@/components/Header";
import ListItems from "@/components/ListItems";

export default function Home() {
   return (
      <div className="bg-neutral-900 rounded-lg  w-full overflow-hidden h-full overflow-y-auto">
         <Header>
            <div className="mb-2">
               <h1 className="text-white font-semibold text-3xl ">Welcome back</h1>
               <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 mt-4">
                  <ListItems image="/images/liked.png" name="Liked Songs" href="liked" />
               </div>
            </div>
         </Header>
         <div className="mt-2 mb-7 px-6">
            <div className="flex justify-between items-center">
               <h1 className="text-white text-2xl font-semibold">Newest Song</h1>
            </div>
            <div>List of Songs!</div>
         </div>
      </div>
   );
}
