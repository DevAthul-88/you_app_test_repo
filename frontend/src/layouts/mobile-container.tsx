"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface MobileContainerProps {
    children: React.ReactNode
    className?: string
}

export function MobileContainer({ children, className }: MobileContainerProps) {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const formattedTime = currentTime.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
    });

    return (
        <div className="min-h-screen w-full flex items-center justify-center fixed "
            style={{
                background: 'radial-gradient(121.73% 121.49% at 100% -3.39%, #1F4247 0%, #0D1D23 56.18%, #09141A 100%)'
            }}>
            <div
                className={cn(
                    "w-full h-screen-safe md:w-[390px] overflow-scroll border-2 border-gray-400 overflow-hidden",
                    "md:rounded-[44px] md:shadow-2xl",
                    "relative",
                    className
                )}
                style={{
                    background: 'rgba(9, 20, 26, 1)'
                }}
            >
                <div className="h-11 px-5 flex items-center justify-between border-b border-gray-700/20">
                    <div className="flex items-center">
                        <span className="text-gray-300 text-sm font-medium">{formattedTime}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="w-6 h-3 bg-gray-600 rounded-sm"></div>
                        <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
                        <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
                    </div>
                </div>

                <div className="h-[calc(100%-2.75rem)] relative overflow-y-auto">
                    {children}
                </div>
            </div>
        </div>
    );
}