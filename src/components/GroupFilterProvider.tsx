import { useState, ReactNode } from 'react';
import { GroupFilterContext } from '../contexts/GroupFilterContext';

interface GroupFilterProviderProps {
  children: ReactNode;
}

export function GroupFilterProvider({ children }: GroupFilterProviderProps) {
  const [groupId, setGroupId] = useState<string>('');
  const [availableGroupIds, setAvailableGroupIds] = useState<string[]>([]);

  const clearFilter = () => {
    setGroupId('');
  };

  return (
    <GroupFilterContext.Provider value={{
      groupId,
      setGroupId,
      clearFilter,
      availableGroupIds,
      setAvailableGroupIds
    }}>
      {children}
    </GroupFilterContext.Provider>
  );
}
