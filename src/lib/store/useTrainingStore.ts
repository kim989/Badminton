import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface RoutineTask {
  id: string;
  week: number;
  title: string;
  targetCount: string;
  completed: boolean;
}

interface TrainingState {
  currentWeek: number;
  completedItems: Record<string, boolean>; // e.g. { 'w1-task1': true }
  totalSecondsTrained: number;
  setCurrentWeek: (week: number) => void;
  toggleTask: (taskId: string) => void;
  addTrainingTime: (seconds: number) => void;
  resetProgress: () => void;
}

export const useTrainingStore = create<TrainingState>()(
  persist(
    (set) => ({
      currentWeek: 1,
      completedItems: {},
      totalSecondsTrained: 0,
      setCurrentWeek: (week) => set({ currentWeek: week }),
      toggleTask: (taskId) =>
        set((state) => ({
          completedItems: {
            ...state.completedItems,
            [taskId]: !state.completedItems[taskId],
          },
        })),
      addTrainingTime: (seconds) =>
        set((state) => ({
          totalSecondsTrained: state.totalSecondsTrained + seconds,
        })),
      resetProgress: () => set({ completedItems: {}, totalSecondsTrained: 0 }),
    }),
    {
      name: 'badminton-training-storage',
    }
  )
);
