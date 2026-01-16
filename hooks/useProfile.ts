import { useCallback, useEffect, useState } from "react";
import { loadProfile, saveProfile } from "../lib/storage";
import { Profile } from "../types/models";

export function useProfile() {
  const [profile, setProfile] = useState<Profile>({
    nickname: "你",
    showOnPoster: true,
  });
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    const data = await loadProfile();
    setProfile(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const updateProfile = useCallback(
    async (next: Profile) => {
      setProfile(next);
      await saveProfile(next);
    },
    []
  );

  return {
    profile,
    loading,
    reload,
    updateProfile,
  };
}
