'use client'
import Background from '@/components/Background'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import React, { useEffect, useState } from 'react';
import { User, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LoginUser } from '@/APIS';
import clsx from 'clsx';
import { triggerToast } from '@/utills';
import { useYoutubecontext } from '@/contextAPI/YoutubeContextAPI';
import { createPortal } from 'react-dom';
import Toast from '@/components/model/Toast';

const SignInpage = () => {
    const router = useRouter();
    const { setShowToast, setToastMessage } = useYoutubecontext()
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<{ status: number, message: string }>()

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await LoginUser({
                username: username,
                email: email,
                password: password
            }, setError, setLoading)
            // console.log("response:", response)
            if (response?.statusCode === 200) {
                triggerToast("Login successful", setToastMessage, setShowToast)
                router.replace("/")
            } else {
                triggerToast("Failed to login", setToastMessage, setShowToast)
            }
        } catch (err: any) {
            console.log("Login page-> handleSubmit function error: ", err);
        }
    };

    return (
        <React.Fragment>
            <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden">
                <Background />

                <div className="relative z-10 w-full max-w-md px-6">
                    <div className="bg-[#121214] border border-white/5 rounded-2xl p-8 shadow-2xl backdrop-blur-sm">

                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
                                Welcome Back
                            </h1>
                            <p className="text-gray-400 text-sm font-medium">
                                Sign in to manage your channel.
                            </p>
                        </div>

                        <form onSubmit={(e) => handleSubmit(e)} className="space-y-4">
                            <Input
                                type="text"
                                placeholder="Username"
                                icon={User}
                                value={username}
                                onChange={(e) => {
                                    setError((prev) => ({ ...prev, status: 0, message: "" }))
                                    setUsername(e.target.value)
                                }}
                                required
                                className={clsx(
                                    error?.status === 404
                                        ? 'border-red-500/50 ring-1 ring-red-500/50' // ✅ red border always
                                        : 'border-white/10 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50'
                                )}
                            />

                            <Input
                                type="email"
                                placeholder="Email Address"
                                icon={Mail}
                                value={email}
                                onChange={(e) => {
                                    setError((prev) => ({ ...prev, status: 0, message: "" }))
                                    setEmail(e.target.value)
                                }}
                                required
                                className={clsx(
                                    error?.status === 404
                                        ? 'border-red-500/50 ring-1 ring-red-500/50'
                                        : 'border-white/10 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50'
                                )}
                            />

                            <Input
                                type="password"
                                placeholder="Password"
                                icon={Lock}
                                value={password}
                                onChange={(e) => {
                                    setError((prev) => ({ ...prev, status: 0, message: "" }))
                                    setPassword(e.target.value)
                                }}
                                required
                                className={clsx(
                                    error?.status === 401
                                        ? 'border-red-500/50 ring-1 ring-red-500/50'
                                        : 'border-white/10 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50'
                                )}
                            />

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`w-full mt-4 bg-gradient-to-r from-blue-600 to-purple-600 
                                    hover:from-blue-500 hover:to-purple-500 text-white font-semibold 
                                    py-3.5 rounded-xl shadow-lg shadow-blue-900/20 transition-all 
                                    duration-300 transform active:scale-[0.98] flex items-center 
                                    justify-center gap-2
                                    ${loading ? "opacity-80 cursor-not-allowed" : ""}`}
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="h-5 w-5 animate-spin" />
                                            <span>Creating...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>Create Account</span>
                                            <ArrowRight size={18} />
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                        <div className={error?.message && 'mt-5 text-red-400 font-light'}>
                            {error?.message && <p>{error.message}</p>}
                        </div>
                        <div className="mt-8 pt-6 border-t border-white/5 text-center">
                            <p className="text-gray-400 text-sm">
                                Don't have an account?{' '}
                                <Link href={'/signup'} className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">Signup</Link>
                            </p>
                        </div>
                    </div>
                </div>
                {mounted && createPortal(<Toast />, document.body)}
            </div>

        </React.Fragment>
    )
}

export default SignInpage