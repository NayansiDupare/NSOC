import { create } from "zustand";

type ExperienceState = {
  activeRole: string;
  setActiveRole: (role: string) => void;
};

export const useExperienceStore = create<ExperienceState>((set) => ({
  activeRole: "contributor",
  setActiveRole: (activeRole) => set({ activeRole }),
}));
