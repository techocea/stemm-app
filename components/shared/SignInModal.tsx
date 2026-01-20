"use client";

import axios from "axios";
import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { ArrowLeft, LogIn, Mail } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

const SignInModal = () => {
    const [email, setEmail] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(false);

        try {
            const res = await axios.post("/api/auth/signup", { email });
            if (res.data.success) {
                setIsSubmitted(true);
            } else {
                alert(res.data.message || "An error occurred. Please try again.");
            }
        } catch (error) {
            console.error("Error during signup:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" className="text-sm font-medium">
                    <LogIn /> Log In
                </Button>
            </DialogTrigger>
            <DialogContent
                showCloseButton={false}
                className="p-0 border-0 rounded-3xl"
            >
                <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-[0_0_100px_rgba(99,102,241,0.2)] overflow-hidden animate-in zoom-in slide-in-from-bottom-8 duration-500">
                    <div className="bg-indigo-600 p-10 text-white text-center relative overflow-hidden">
                        <h1 className="text-3xl font-black tracking-tight relative z-10">
                            Welcome to Lumina
                        </h1>
                        <p className="text-indigo-100 mt-2 font-medium opacity-80 relative z-10">
                            Sri Lanka's #1 AI Education Assistant
                        </p>
                    </div>

                    <div className="p-10">
                        {!isSubmitted ? (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="block text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">
                                        Email Address
                                    </label>
                                    <div className="relative group">
                                        <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                                            <Mail />
                                        </span>
                                        <Input
                                            type="email"
                                            value={email}
                                            placeholder="name@university.edu"
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full pl-12 pr-6 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 transition-all dark:text-white"
                                        />
                                    </div>
                                </div>

                                <Button
                                    size="lg"
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-lg transition-all shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-3 active:scale-[0.98]"
                                >
                                    {isLoading ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    ) : (
                                        "Send Magic Link"
                                    )}
                                </Button>

                                <div className="pt-2">
                                    <p className="text-center text-[10px] text-slate-400 uppercase font-black tracking-widest opacity-60">
                                        Passwordless Security Protocol
                                    </p>
                                </div>
                            </form>
                        ) : (
                            <div className="text-center space-y-8 animate-in fade-in slide-in-from-bottom-4">
                                <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 rounded-full flex items-center justify-center text-4xl mx-auto border-4 border-emerald-500/10 shadow-lg shadow-emerald-500/10">
                                    📧
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black dark:text-white">
                                        Check your Inbox
                                    </h2>
                                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm leading-relaxed">
                                        We've sent a magic login link to <br />{" "}
                                        <span className="font-bold text-indigo-600">{email}</span>
                                        . <br />
                                        Click it to verify your account.
                                    </p>
                                </div>

                                <Button
                                    size="lg"
                                    onClick={() => setIsSubmitted(false)}
                                    className="text-xs font-black text-indigo-600 uppercase tracking-widest transition-colors"
                                >
                                    <ArrowLeft /> Use a different email
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default SignInModal;
