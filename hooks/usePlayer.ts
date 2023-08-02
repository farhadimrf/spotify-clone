import { create } from "zustand";

interface PlayerStore {
  ids: string[];
  activeId?: string;
  setIds: (ids: string[]) => void;
  setId: (id: string) => void;
  reset: () => void;
}

const usePlayer = create<PlayerStore>((set) => ({
  ids: [],
  activeId: undefined,
  setId: (id: string) => set({ activeId: id }),
  setIds: (ids: string[]) => set({ ids }),
  reset: () => set({ ids: [], activeId: undefined }),
}));

export default usePlayer;
