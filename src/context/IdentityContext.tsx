'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface IdentityContextType {
    leadId: string | null;
    userName: string | null;
    email: string | null;
    avatar: string | null;
    instagram: string | null;
    isProfileComplete: boolean;
    missionProgress: number | null;
    missionData: string[];
    isLoading: boolean;
    updateMissionProgress: (progress: number, data?: string[]) => void;
    refreshIdentity: () => Promise<void>;
}

const IdentityContext = createContext<IdentityContextType>({
    leadId: null,
    userName: null,
    email: null,
    avatar: null,
    instagram: null,
    isProfileComplete: false,
    missionProgress: null,
    missionData: [],
    isLoading: true,
    updateMissionProgress: () => { },
    refreshIdentity: async () => { },
});

export function IdentityProvider({ children }: { children: ReactNode }) {
    const [leadId, setLeadId] = useState<string | null>(null);
    const [userName, setUserName] = useState<string | null>(null);
    const [email, setEmail] = useState<string | null>(null);
    const [avatar, setAvatar] = useState<string | null>(null);
    const [instagram, setInstagram] = useState<string | null>(null);
    const [isProfileComplete, setIsProfileComplete] = useState(false);
    const [missionProgress, setMissionProgress] = useState<number | null>(null);
    const [missionData, setMissionData] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const searchParams = useSearchParams();
    const router = useRouter();

    const updateMissionProgress = (progress: number, data?: string[]) => {
        setMissionProgress(progress);
        if (data) setMissionData(data);
    };

    const fetchProfile = async (id: string) => {
        try {
            console.log("IdentityContext: Fetching profile for", id);
            const res = await fetch('/api/identify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ leadId: id })
            });

            const data = await res.json();

            if (data.success && data.data) {
                console.log("IdentityContext: Profile loaded", data.data.name);
                setUserName(data.data.name);
                setEmail(data.data.email);
                setAvatar(data.data.avatar);
                setInstagram(data.data.contactDetails?.instagram || null);
                setIsProfileComplete(data.data.isProfileComplete);
                setMissionProgress(data.data.missionProgress);
                setMissionData(data.data.missionData || []);
            } else {
                console.warn("IdentityContext: Profile fetch failed or invalid ID", data);
            }
        } catch (fetchError) {
            console.error("IdentityContext: Fetch error", fetchError);
        }
    };

    const refreshIdentity = async () => {
        if (leadId) {
            await fetchProfile(leadId);
        }
    };

    useEffect(() => {
        let isMounted = true;
        const failsafeTimer = setTimeout(() => {
            if (isMounted) {
                console.warn("IdentityContext: Loading timed out. Forcing completion.");
                setIsLoading(false);
            }
        }, 8000); // 8 second max load time

        const checkIdentity = async () => {
            // 1. Try to get ID from URL
            const urlId = searchParams.get('id');

            // If we have a URL ID and it's different from current leadId, we MUST update
            if (urlId && urlId !== leadId) {
                console.log("IdentityContext: Found new ID in URL:", urlId);
                setLeadId(urlId);
                try { localStorage.setItem('techalley_lead_id', urlId); } catch (e) { }
                setIsLoading(true);
                await fetchProfile(urlId);

                if (isMounted) {
                    setIsLoading(false);
                    clearTimeout(failsafeTimer);
                }
                return;
            }

            // If we are already loaded, we don't need to do anything unless it's a fresh load
            if (!isLoading) return;

            try {
                // 2. Try to get ID from localStorage (persistence)
                let localId = null;
                try {
                    localId = localStorage.getItem('techalley_lead_id');
                } catch (e) {
                    console.error("Storage access error:", e);
                }

                const activeId = urlId || localId;

                if (activeId) {
                    console.log("IDENTITY DEBUG: Found activeId from:", urlId ? "URL" : "Local", activeId);
                    setLeadId(activeId);
                    if (urlId) {
                        try { localStorage.setItem('techalley_lead_id', urlId); } catch (e) { }
                    }

                    // Fetch details
                    await fetchProfile(activeId);

                } else {
                    console.log("IdentityContext: No ID found");
                }
            } catch (error) {
                console.error("IdentityContext: Critical Error", error);
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                    clearTimeout(failsafeTimer);
                }
            }
        };

        // 3. Check Supabase Auth (The missing link for Google OAuth)
        const checkAuth = async () => {
            const supabase = createClientComponentClient();
            const { data: { session } } = await supabase.auth.getSession();

            if (session?.user?.id) {
                console.log("IDENTITY DEBUG: Found Supabase Auth User:", session.user.id);
                setLeadId(session.user.id);
                await fetchProfile(session.user.id);
            } else {
                // Fallback to URL/Local if no Auth session
                // 3. Check Supabase Auth (The missing link for Google OAuth)
                const checkAuth = async () => {
                    const supabase = createClientComponentClient();
                    const { data: { session } } = await supabase.auth.getSession();

                    if (session?.user?.id) {
                        console.log("IDENTITY DEBUG: Found Supabase Auth User via Session:", session.user.id);
                        setLeadId(session.user.id);
                        await fetchProfile(session.user.id);
                    } else {
                        // Fallback to URL/Local if no Auth session
                        checkIdentity();
                    }
                };

                checkAuth();
            }
        };

        checkAuth();

        return () => { isMounted = false; clearTimeout(failsafeTimer); };
    }, [searchParams, isLoading, leadId]);

    return (
        <IdentityContext.Provider value={{ leadId, userName, email, avatar, instagram, isProfileComplete, missionProgress, missionData, isLoading, updateMissionProgress, refreshIdentity }}>
            {children}
        </IdentityContext.Provider>
    );
}

export const useIdentity = () => useContext(IdentityContext);
