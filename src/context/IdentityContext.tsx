'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

interface IdentityContextType {
    leadId: string | null;
    userName: string | null;
    email: string | null;
    avatar: string | null;
    instagram: string | null;
    isProfileComplete: boolean;
    missionProgress: string | null;
    isLoading: boolean;
    updateMissionProgress: (progress: string) => void;
}

const IdentityContext = createContext<IdentityContextType>({
    leadId: null,
    userName: null,
    email: null,
    avatar: null,
    instagram: null,
    isProfileComplete: false,
    missionProgress: null,
    isLoading: true,
    updateMissionProgress: () => { },
});

export function IdentityProvider({ children }: { children: ReactNode }) {
    const [leadId, setLeadId] = useState<string | null>(null);
    const [userName, setUserName] = useState<string | null>(null);
    const [email, setEmail] = useState<string | null>(null);
    const [avatar, setAvatar] = useState<string | null>(null);
    const [instagram, setInstagram] = useState<string | null>(null);
    const [isProfileComplete, setIsProfileComplete] = useState(false);
    const [missionProgress, setMissionProgress] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const searchParams = useSearchParams();
    const router = useRouter();

    const updateMissionProgress = (progress: string) => {
        setMissionProgress(progress);
    };

    useEffect(() => {
        let isMounted = true;
        const failsafeTimer = setTimeout(() => {
            if (isMounted) {
                console.warn("IdentityContext: Loading timed out. Forcing completion.");
                setIsLoading(false);
            }
        }, 8000); // 8 second max load time

        const initIdentity = async () => {
            try {
                // 1. Try to get ID from URL
                const urlId = searchParams.get('id');

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
                    console.log("IdentityContext: Fetching profile for", activeId);
                    const res = await fetch('/api/identify', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ leadId: activeId })
                    });

                    const data = await res.json();

                    if (isMounted) {
                        if (data.success && data.data) {
                            console.log("IdentityContext: Profile loaded", data.data.name);
                            setUserName(data.data.name);
                            setEmail(data.data.email);
                            setAvatar(data.data.avatar);
                            setInstagram(data.data.contactDetails?.instagram || null);
                            setIsProfileComplete(data.data.isProfileComplete);
                            setMissionProgress(data.data.missionProgress);
                        } else {
                            console.warn("IdentityContext: Profile fetch failed or invalid ID", data);
                            // Invalid ID? Maybe clear it so we don't loop?
                            if (localId && !urlId) {
                                localStorage.removeItem('techalley_lead_id');
                            }
                        }
                    }
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

        if (isLoading) {
            initIdentity();
        }

        return () => { isMounted = false; clearTimeout(failsafeTimer); };
    }, [searchParams]);

    return (
        <IdentityContext.Provider value={{ leadId, userName, email, avatar, instagram, isProfileComplete, missionProgress, isLoading, updateMissionProgress }}>
            {children}
        </IdentityContext.Provider>
    );
}

export const useIdentity = () => useContext(IdentityContext);
