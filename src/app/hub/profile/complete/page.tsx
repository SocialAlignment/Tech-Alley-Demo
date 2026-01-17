"use client"

import { useState, useRef } from 'react';
import { OnboardingForm } from '@/components/ui/onboarding-form';
import { useRouter } from 'next/navigation';
import { useIdentity } from '@/context/IdentityContext';

export default function ProfileCompletePage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadedImage, setUploadedImage] = useState<string | undefined>(undefined);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { leadId } = useIdentity();
    const router = useRouter();

    // Handle form submission (Preferred Name)
    const handleCreateAccount = async (preferredName: string) => {
        setIsSubmitting(true);

        try {
            const response = await fetch('/api/profile/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    leadId,
                    preferredName,
                    // avatarUrl: uploadedImage // We can't send blob URLs to Notion. Need real storage first.
                }),
            });

            if (!response.ok) throw new Error('Failed to update profile');

            // Success
            alert("Preferred Name saved to Notion! \n\n(Avatar upload requires cloud storage setup - skipped for now)");
            // Navigate to next qualification step
            router.push(leadId ? `/hub/profile/qualify?id=${leadId}` : '/hub/profile/qualify');

        } catch (error) {
            console.error(error);
            alert("Error updating profile. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle File Upload Trigger
    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    // Handle File Selection
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            // Create a local preview URL
            const imageUrl = URL.createObjectURL(file);
            setUploadedImage(imageUrl);
            // TODO: Upload file to storage and update Notion profile image property
            console.log("File selected:", file.name);
        }
    };

    return (
        <div className="flex min-h-screen w-full items-center justify-center p-4 bg-[#020817] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]">
            {/* Hidden File Input */}
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/png, image/jpeg"
                onChange={handleFileChange}
            />

            <OnboardingForm
                imageSrc="/tech-alley-logo.png"
                avatarSrc={uploadedImage}
                avatarFallback="ME"
                title="Welcome, let's complete your profile!"
                description="Add your profile pic and your preferred name."
                inputPlaceholder="Preferred Name (e.g. Johnny)"
                buttonText="Get Started"
                onUploadClick={handleUploadClick}
                onSubmit={handleCreateAccount}
                isSubmitting={isSubmitting}
                showNameField={true}
            />
        </div>
    );
}
