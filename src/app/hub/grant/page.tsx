"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useIdentity } from '@/context/IdentityContext';
import IWTGrantQualifier from '@/components/ui/grant-application-wizard';
import { HubLandingNavbar } from '@/components/landing/HubLandingNavbar';
import { GrantHero } from '@/components/landing/GrantHero';
import { GrantInfo } from '@/components/landing/GrantInfo';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function GrantApplicationPage() {
    const router = useRouter();
    const { leadId } = useIdentity();
    const [isLoading, setIsLoading] = useState(true);
    const [initialData, setInitialData] = useState<any>({});

    useEffect(() => {
        const checkIdentity = async () => {
            let currentLeadId = leadId;
            if (!currentLeadId && typeof window !== 'undefined') {
                currentLeadId = localStorage.getItem('techalley_lead_id');
            }

            if (currentLeadId) {
                try {
                    const res = await fetch('/api/identify', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ leadId: currentLeadId })
                    });

                    if (res.ok) {
                        const responseHelper = await res.json();
                        const data = responseHelper.data;

                        setInitialData((prev: any) => ({
                            ...prev,
                            // Map API data to component props
                            contactName: data.firstName && data.lastName ? `${data.firstName} ${data.lastName}` : prev.contactName,
                            contactEmail: data.email || prev.contactEmail,
                            contactPhone: data.phone || prev.contactPhone,
                            websiteUrl: data.contactDetails?.website || prev.websiteUrl
                        }));
                    }
                } catch (e) {
                    console.error("Failed to hydrate:", e);
                }
            }
            setIsLoading(false);
        };

        checkIdentity();
    }, [leadId]);

    const handleSubmit = async (data: any, status: 'qualified' | 'disqualified' | 'needs_review') => {
        if (!leadId) {
            alert("No Lead ID found. Please go back to Onboarding.");
            return;
        }

        try {
            const { error } = await supabase
                .from('iwt_qualifications')
                .insert([
                    {
                        lead_id: leadId,
                        qualification_status: status,
                        contact_name: data.contactName,
                        contact_email: data.contactEmail,
                        contact_phone: data.contactPhone,
                        business_name: data.businessName,
                        business_address: data.businessAddress,
                        ein: data.ein,
                        has_business_license: data.hasBusinessLicense,
                        has_workers_comp: data.hasWorkersComp,
                        has_liability_insurance: data.hasLiabilityInsurance,
                        has_payroll_systems: data.hasPayrollSystems,
                        purpose_avert_layoff: data.purposeAvertLayoff,
                        purpose_wage_increase: data.purposeWageIncrease,
                        purpose_promotion: data.purposePromotion,
                        purpose_title_change: data.purposeTitleChange,
                        trainee_count: parseInt(data.traineeCount) || 0,
                        employees_work_authorized: data.employeesWorkAuthorized,
                        employees_performance_qualified: data.employeesPerformanceQualified,
                        commit_to_retention: data.commitToRetention,
                        will_displace_employees: data.willDisplaceEmployees,
                        training_already_started: data.trainingAlreadyStarted,
                        training_type: data.trainingType,
                        training_provider: data.trainingProvider,
                        estimated_cost: parseFloat(data.estimatedCost) || 0,
                        preferred_timeline: data.preferredTimeline
                    }
                ]);

            if (error) {
                console.error("Supabase error:", error);
                throw error;
            }

            // Redirect based on status or just to hub?
            // If qualified, maybe show a success message or redirect?
            // For now, redirect to hub as per requirements.
            router.push('/hub');
        } catch (error) {
            console.error(error);
            alert("Failed to submit application. Please try again.");
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#020617] flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full bg-slate-950 font-sans selection:bg-violet-500/30">
            <HubLandingNavbar
                links={[
                    { label: "Benefits", onClick: () => document.getElementById('grant-info')?.scrollIntoView({ behavior: 'smooth' }) },
                    { label: "Criteria", onClick: () => document.getElementById('grant-info')?.scrollIntoView({ behavior: 'smooth' }) }
                ]}
                cta={{ label: "Apply Now", onClick: () => document.getElementById('grant-application-form')?.scrollIntoView({ behavior: 'smooth' }) }}
            />

            <GrantHero />

            <div id="grant-info">
                <GrantInfo />
            </div>

            <div id="grant-application-form" className="py-24 bg-slate-900/50 relative">
                <div className="container mx-auto px-4 max-w-3xl">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-white mb-4">Application Form</h2>
                        <p className="text-slate-400">Complete the wizard below to submit your application.</p>
                    </div>

                    <div className="bg-slate-950 border border-white/5 rounded-2xl p-6 md:p-10 shadow-2xl">
                        <IWTGrantQualifier
                            onSubmit={handleSubmit}
                            isSubmitting={false}
                            initialValues={initialData}
                        />
                    </div>
                </div>
            </div>

            {/* Simple Footer */}
            <footer className="py-8 bg-slate-950 border-t border-white/5 text-center text-slate-600 text-sm">
                <p>© {new Date().getFullYear()} Social Alignment. All rights reserved.</p>
            </footer>
        </div>
    );
}
