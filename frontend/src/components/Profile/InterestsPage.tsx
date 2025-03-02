"use client";

import { useAuthStore } from '@/store/authStore';
import { ChevronLeft, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api';

export default function InterestsPage() {
    const router = useRouter();
    const user = useAuthStore((state) => state.user);
    const [interests, setInterests] = useState<string[]>(user?.interests || []);
    const [inputValue, setInputValue] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user?.interests) {
            setInterests(user.interests);
        }
    }, [user]);

    const addInterest = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && inputValue.trim() !== "") {
            if (!interests.includes(inputValue.trim())) {
                setInterests([...interests, inputValue.trim()]);
            }
            setInputValue("");
            e.preventDefault();
        }
    };

    const removeInterest = (interest: string) => {
        setInterests(interests.filter((item) => item !== interest));
    };

    const handleSaveInterests = async () => {
        try {
            if (interests.length === 0) {
                toast.error('Please select at least one interest.');
                return;
            }

            setLoading(true);
            const response = await authApi.updateProfile({ interests });

            if (response.data || response) {
                const updatedUser = await authApi.getProfile();
                updatedUser.interests = interests;
                useAuthStore.setState({ user: updatedUser });

                toast.success('Interests updated successfully! 🎉');
            } else {
                console.error('Unexpected response format:', response);
                toast.error('Something went wrong. Please try again.');
            }
        } catch (error) {
            console.error('Error updating interests:', error);
            toast.error('Failed to update interests.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen px-4 py-6 bg-[#0E1A1E] text-white">
            <div className="flex justify-between items-center">
                <button onClick={() => router.back()} className="text-gray-300 flex items-center gap-1">
                    <ChevronLeft className="w-5 h-5" />
                    Back
                </button>
                <button
                    onClick={handleSaveInterests}
                    className="text-blue-500 font-medium"
                    disabled={loading}
                >
                    {loading ? 'Saving...' : 'Save'}
                </button>
            </div>

            <div className="mt-8">
                <p className="text-sm text-[#D5BE88]">Tell everyone about yourself</p>
                <h1 className="text-2xl font-semibold mt-2">What interests you?</h1>
            </div>

            <div className="mt-4 bg-[#18272B] p-3 rounded-lg flex flex-wrap gap-2 min-h-[50px]">
                {interests.map((interest, index) => (
                    <span
                        key={index}
                        className="flex items-center bg-[#22363A] text-sm px-3 py-1 rounded-full text-white"
                    >
                        {interest}
                        <X className="w-4 h-4 ml-2 cursor-pointer" onClick={() => removeInterest(interest)} />
                    </span>
                ))}
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={addInterest}
                    placeholder="Add an interest"
                    className="bg-transparent focus:outline-none text-white placeholder-gray-500 flex-1"
                />
            </div>
        </div>
    );
}
