import { Button, ButtonProps } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface GoButtonProps extends ButtonProps {
    text?: string;
}

export function GoButton({ className, text = "Go", ...props }: GoButtonProps) {
    return (
        <Button
            className={cn("group relative overflow-hidden pl-6 pr-14", className)}
            size="lg"
            {...props}
        >
            <span className="transition-opacity duration-500 group-hover:opacity-0 font-bold">
                {text}
            </span>
            <i className="absolute right-1 top-1 bottom-1 rounded-sm z-10 grid w-12 place-items-center transition-all duration-500 bg-primary-foreground/20 group-hover:w-[calc(100%-0.5rem)] group-active:scale-95">
                <ChevronRight size={20} strokeWidth={2.5} aria-hidden="true" />
            </i>
        </Button>
    );
}
