import { useState, useEffect, useCallback } from 'react';
import { Group } from '@/types';
import { loadGroups, saveGroups, normalizeGroupName, syncGroupsWithSites, uniqueGroups, defaultGroups } from '@/utils/normalization';
import { Site } from '@/types';

export function useGroups(sites: Site[]) {
  const [groups, setGroups] = useState<Group[]>([]);

  useEffect(() => {
    const loaded = loadGroups();
    setGroups(loaded);
  }, []);

  useEffect(() => {
    const synced = syncGroupsWithSites(groups, sites);
    if (synced.length !== groups.length || synced.some((g, i) => g !== groups[i])) {
      setGroups(synced);
      saveGroups(synced);
    }
  }, [groups, sites]);

  const addGroup = useCallback((name: string) => {
    const normalized = normalizeGroupName(name);
    if (!normalized || groups.includes(normalized)) {
      return false;
    }

    const newGroups = [...groups, normalized];
    const unique = uniqueGroups(newGroups);
    setGroups(unique);
    saveGroups(unique);
    return true;
  }, [groups]);

  const renameGroup = useCallback((oldName: string, newName: string) => {
    const normalized = normalizeGroupName(newName);
    if (!normalized || (groups.includes(normalized) && normalized !== oldName)) {
      return { success: false, error: groups.includes(normalized) ? '分组已存在。' : '分组名不能为空。' };
    }

    const newGroups = groups.map(g => g === oldName ? normalized : g);
    setGroups(newGroups);
    saveGroups(newGroups);
    return { success: true, error: null };
  }, [groups]);

  const deleteGroup = useCallback((name: string) => {
    const newGroups = groups.filter(g => g !== name);
    const unique = uniqueGroups(newGroups);
    setGroups(unique);
    saveGroups(unique);
    return true;
  }, [groups]);

  const resetDefaultGroups = useCallback(() => {
    setGroups(defaultGroups);
    saveGroups(defaultGroups);
  }, []);

  return {
    groups,
    addGroup,
    renameGroup,
    deleteGroup,
    resetDefaultGroups
  };
}
