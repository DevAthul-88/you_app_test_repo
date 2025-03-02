"use client"

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { authApi } from '@/lib/api';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';


const loginSchema = z.object({
    identifier: z
        .string()
        .min(1, 'Email or username is required'),
    password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
});

type LoginForm = z.infer<typeof loginSchema>;

interface MobileContainerProps {
    children: React.ReactNode;
    className?: string;
}

function MobileContainer({ children, className }: MobileContainerProps) {
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
        <div className="min-h-screen w-full flex items-center justify-center fixed overflow-hidden"
            style={{
                background: 'radial-gradient(121.73% 121.49% at 100% -3.39%, #1F4247 0%, #0D1D23 56.18%, #09141A 100%)'
            }}>
            <div
                className={cn(
                    "w-full h-screen-safe md:h-[844px] md:w-[390px]",
                    "md:rounded-[44px] md:shadow-2xl overflow-hidden",
                    "relative",
                    className
                )}
                style={{
                    background: 'radial-gradient(121.73% 121.49% at 100% -3.39%, #1F4247 0%, #0D1D23 56.18%, #09141A 100%)'
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

const LoginPage = () => {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const setToken = useAuthStore((state) => state.setToken);

    const { register, handleSubmit, formState: { errors, isValid }, watch } = useForm<LoginForm>({
        resolver: zodResolver(loginSchema),
        mode: 'onChange'
    });

    const watchAllFields = watch();
    const isFormEmpty = !watchAllFields.identifier && !watchAllFields.password;

    const onSubmit = async (data: LoginForm) => {
        try {
            setIsLoading(true);

            const isEmail = data.identifier.includes('@');

            const loginData = {
                email: isEmail ? data.identifier : '',
                username: !isEmail ? data.identifier : '',
                password: data.password
            };

            const response = await authApi.login(loginData);
           
            if(response?.message == "User not found"){
                toast.error('User not found');
            }

            if(response?.access_token){
                localStorage.setItem("token", response.access_token);
                setToken(response.access_token);
                toast.success(response?.message);
                router.push('/profile');
            }

 
        } catch (error) {
            toast.error('Something went wrong');
            console.error('Login failed:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (

        <MobileContainer>
            <div className="px-6 py-4 flex items-center gap-2">
                <Link
                    href={"/register"}
                    className="text-white flex items-center gap-2"
                >
                    <ArrowLeft size={24} />
                    <span>Back</span>
                </Link>
            </div>

            <div className="px-6 pt-8">
                <h1 className="text-2xl font-semibold text-white mb-8">Login</h1>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-4">
                        <div>
                            <input
                                type="text"
                                {...register('identifier')}
                                placeholder="johndoe@gmail.com"
                                className={`w-full bg-white/[0.06] text-white rounded-xl px-4 py-4 outline-none border ${errors.identifier ? 'border-red-500' : 'border-transparent'}`}
                            />
                            {errors.identifier && (
                                <span className="text-red-500 text-sm mt-1">{errors.identifier.message}</span>
                            )}
                        </div>

                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                {...register('password')}
                                placeholder="••••••••"
                                className={`w-full bg-white/[0.06] text-white rounded-xl px-4 py-4 outline-none border ${errors.password ? 'border-red-500' : 'border-transparent'}`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                            {errors.password && (
                                <span className="text-red-500 text-sm mt-1">{errors.password.message}</span>
                            )}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isFormEmpty || !isValid || isLoading}
                        className="w-full text-white font-medium rounded-xl py-4 mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{
                            background: 'linear-gradient(108.32deg, rgba(98, 205, 203, 0.5) 24.88%, rgba(69, 153, 219, 0.5) 78.49%)'
                        }}
                    >
                        {isLoading ? 'Loading...' : 'Login'}
                    </button>
                </form>

                <div className="flex items-center justify-center mt-8 text-white">
                    <span>Don&apos;t have an account?</span>
                    <Link
                        href="/register"
                        className="text-[#2DD4BF] ml-1 hover:text-[#2DD4BF]/90"
                    >
                        Register here
                    </Link>
                </div>
            </div>
        </MobileContainer>


    );
};

export default LoginPage;