import Header from "@/components/Header";
import AccountContent from "./components/AccountContent";

const page = () => {
  return (
    <div className="h-full w-full overflow-hidden overflow-y-hidden rounded-lg bg-neutral-900">
      <Header className="from-neutral-900">
        <div className="mb-2 flex flex-col gap-y-6">
          <h1 className="text-3xl font-semibold text-white">Account Setting</h1>
        </div>
      </Header>
      <AccountContent />
    </div>
  );
};

export default page;
