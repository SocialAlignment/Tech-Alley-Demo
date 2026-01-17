import { usePathname, useRouter } from 'next/navigation';
import {
    Popover,
    PopoverBody,
    PopoverContent,
    PopoverDescription,
    PopoverHeader,
    PopoverTitle,
    PopoverTrigger,
    PopoverFooter,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { User, Settings, CheckSquare } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useIdentity } from '@/context/IdentityContext';

export default function UserProfileDemo() {
    const router = useRouter();
    const { userName, email, avatar, isProfileComplete, leadId } = useIdentity();

    // Default Fallback values
    const displayName = userName || 'Guest User';
    const displayEmail = email || 'guest@techalley.org';
    const displayAvatar = avatar && avatar.trim() !== '' ? avatar : '/default-avatar.png';

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" className="w-full h-auto p-2 flex items-center justify-start gap-3 hover:bg-white/10 rounded-xl">
                    <Avatar className="h-10 w-10 border border-white/10">
                        <AvatarImage src={displayAvatar} className="object-cover" />
                        <AvatarFallback>{displayName.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-start text-left overflow-hidden">
                        <span className="text-sm font-bold text-white truncate w-full">{displayName}</span>
                        <span className="text-xs text-slate-400 truncate w-full">{displayEmail}</span>
                    </div>
                </Button>
            </PopoverTrigger>
            <PopoverContent className='w-62'>
                <PopoverHeader>
                    <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                            <AvatarImage src={displayAvatar} className="object-cover" />
                            <AvatarFallback>{displayName.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="overflow-hidden">
                            <PopoverTitle className="truncate">{displayName}</PopoverTitle>
                            <PopoverDescription className='text-xs truncate'>{displayEmail}</PopoverDescription>
                        </div>
                    </div>
                </PopoverHeader>
                <PopoverBody className="space-y-1 px-2 py-1">
                    <Button
                        variant="ghost"
                        className={`w-full justify-start font-bold ${isProfileComplete ? 'text-green-400 hover:text-green-300' : 'text-blue-600 hover:text-blue-700 hover:bg-blue-50'}`}
                        size="sm"
                        onClick={() => router.push(leadId ? `/hub/profile/qualify?id=${leadId}` : '/hub/profile/qualify')}
                    >
                        {isProfileComplete ? <CheckSquare className="mr-2 h-4 w-4" /> : <User className="mr-2 h-4 w-4" />}
                        {isProfileComplete ? "View Profile" : "Complete your Profile"}
                    </Button>
                    <Button variant="ghost" className="w-full justify-start" size="sm">
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                    </Button>
                </PopoverBody>
                <PopoverFooter>
                    <Button variant="outline" className="w-full bg-transparent" size="sm">
                        Sign Out
                    </Button>
                </PopoverFooter>
            </PopoverContent>
        </Popover>
    );
}
