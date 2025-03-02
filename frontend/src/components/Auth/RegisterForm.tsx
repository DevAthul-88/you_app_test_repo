"use client"

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { authApi } from '@/lib/api';
import toast from 'react-hot-toast';

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

const registerSchema = z.object({
    email: z
        .string()
        .min(1, 'Email is required')
        .email('Invalid email format'),
    username: z
        .string()
        .min(3, 'Username must be at least 3 characters')
        .max(20, 'Username cannot exceed 20 characters'),
    password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number'),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"]
});

type RegisterForm = z.infer<typeof registerSchema>;

const RegisterPage = () => {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const { register, handleSubmit, formState: { errors, isValid }, watch } = useForm<RegisterForm>({
        resolver: zodResolver(registerSchema),
        mode: 'onChange'
    });

    const watchAllFields = watch();
    const isFormEmpty = !watchAllFields.email && !watchAllFields.username &&
        !watchAllFields.password && !watchAllFields.confirmPassword;

    const password = watch('password');
    const confirmPassword = watch('confirmPassword');
    const passwordsMatch = password === confirmPassword && password !== '';

    const onSubmit = async (data: RegisterForm) => {
        if (!passwordsMatch) return;
        try {
            setIsLoading(true);
            const response = await authApi.register(data);
            
            if(response.message == "User has been created successfully"){
                toast.success(response.message);
                router.push('/');
            }
            else if(response.message == "User already exists"){
                toast.error(response.message);
            }  
            

        } catch (error) {
            toast.error('Something went wrong');
            console.error('Registration failed:', error);
        } finally {
            setIsLoading(false);
        }
    };


    return (
            <MobileContainer>
                <div className="px-6 py-4 flex items-center gap-2">
                    <Link
                        href={"/"}
                        className="text-white flex items-center gap-2"
                    >
                        <ArrowLeft size={24} />
                        <span>Back</span>
                    </Link>
                </div>

                <div className="px-6 pt-8">
                    <h1 className="text-2xl font-semibold text-white mb-8">Register</h1>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-4">
                            <div>
                                <input
                                    type="email"
                                    {...register('email')}
                                    placeholder="johndoe@gmail.com"
                                    className={`w-full bg-white/[0.06] text-white rounded-xl px-4 py-4 outline-none border ${errors.email ? 'border-red-500' : 'border-transparent'}`}
                                />
                                {errors.email && (
                                    <span className="text-red-500 text-sm mt-1">{errors.email.message}</span>
                                )}
                            </div>

                            <div>
                                <input
                                    type="text"
                                    {...register('username')}
                                    placeholder="johndoe123"
                                    className={`w-full bg-white/[0.06] text-white rounded-xl px-4 py-4 outline-none border ${errors.username ? 'border-red-500' : 'border-transparent'}`}
                                />
                                {errors.username && (
                                    <span className="text-red-500 text-sm mt-1">{errors.username.message}</span>
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

                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    {...register('confirmPassword')}
                                    placeholder="••••••••"
                                    className={`w-full bg-white/[0.06] text-white rounded-xl px-4 py-4 outline-none border ${!passwordsMatch && confirmPassword ? 'border-red-500' : 'border-transparent'}`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                                >
                                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                                {!passwordsMatch && confirmPassword && (
                                    <span className="text-red-500 text-sm mt-1">Passwords don&apos;t match</span>
                                )}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isFormEmpty || !isValid || isLoading || !passwordsMatch}
                            className="w-full text-white font-medium rounded-xl py-4 mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{
                                background: 'linear-gradient(108.32deg, rgba(98, 205, 203, 0.5) 24.88%, rgba(69, 153, 219, 0.5) 78.49%)'
                            }}
                        >
                            {isLoading ? 'Loading...' : 'Register'}
                        </button>
                    </form>

                    <div className="flex items-center justify-center mt-8 text-white">
                        <span>Have an account? </span>
                        <Link
                            href="/"
                            className="text-[#2DD4BF] ml-1 hover:text-[#2DD4BF]/90"
                        >
                            Login here
                        </Link>
                    </div>
                </div>
            </MobileContainer>
    );
};

export default RegisterPage;