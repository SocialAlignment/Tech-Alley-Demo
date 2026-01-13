'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

interface IdentityContextType {
    leadId: string | null;
    userName: string | null;
    isLoading: boolean;
}

const IdentityContext = createContext<IdentityContextType>({
    leadId: null,
    userName: null,
    isLoading: true,
});

export function IdentityProvider({ children }: { children: ReactNode }) {
    const [leadId, setLeadId] = useState<string | null>(null);
    const [userName, setUserName] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const searchParams = useSearchParams();
    const router = useRouter();

    useEffect(() => {
        // 1. Try to get ID from URL
        const urlId = searchParams.get('id');

        // 2. Try to get ID from localStorage (persistence)
        const localId = localStorage.getItem('techalley_lead_id');
        const activeId = urlId || localId;

        if (activeId) {
            setLeadId(activeId);
            if (urlId) localStorage.setItem('techalley_lead_id', urlId);

            // Fetch details
            fetch('/api/identify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ leadId: activeId })
            })
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        setUserName(data.data.name);
                    }
                })
                .catch(console.error)
                .finally(() => setIsLoading(false));

        } else {
            setIsLoading(false);
        }
    }, [searchParams]);

    return (
        <IdentityContext.Provider value={{ leadId, userName, isLoading }}>
            {children}
        </IdentityContext.Provider>
    );
}

export const useIdentity = () => useContext(IdentityContext);
