import { useContext } from "react";
import { GroupFilterContext } from "../contexts/GroupFilterContext";

export function useGroupFilter() {
  const context = useContext(GroupFilterContext);
  if (context === undefined) {
    throw new Error("useGroupFilter must be used within a GroupFilterProvider");
  }
  return context;
}
