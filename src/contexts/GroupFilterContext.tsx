import { createContext } from 'react';

interface GroupFilterContextType {
  groupId: string;
  setGroupId: (groupId: string) => void;
  clearFilter: () => void;
  availableGroupIds: string[];
  setAvailableGroupIds: (groupIds: string[]) => void;
}

export const GroupFilterContext = createContext<GroupFilterContextType | undefined>(undefined);

