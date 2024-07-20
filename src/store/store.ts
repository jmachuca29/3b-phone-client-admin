import { create } from "zustand";
import { devtools } from "zustand/middleware";


type Actions = {
  setUser: (infoUser: any) => void;
  removeUser: () => void;
  reset: () => void;
};

type AppState = {
  user: any;
  setFn: Actions;
};

const initialState = {
  user: {},
};

const sharedStateAndActions = (set: any) => ({
  ...initialState,
  setFn: {
    setUser: (infoUser: any) => {
      set({ user: infoUser }, false, "SET USER");
    },
    removeUser: () => {
      set({ user: initialState.user }, false, "REMOVE USER");
    },
    reset: () => set(initialState, false, "RESET"),
  },
});

const useAppStore = create<AppState>()(
  devtools((set) => ({
    ...sharedStateAndActions(set),
  }))
);

export default useAppStore;
