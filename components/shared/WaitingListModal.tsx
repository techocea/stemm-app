"use client";

import { useState } from "react";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { WaitingListModalProps } from "@/types";
import { ArrowRight, Check, Loader2, Send } from "lucide-react";

const WaitingListModal = ({ text, icon }: WaitingListModalProps) => {
    const [email, setEmail] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [status, setStatus] = useState<"idle" | "submitting" | "success">(
        "idle"
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("submitting");
        setError(null);
        try {
            const res = await axios.post("/api/waitlist", { email });
            if (res.status === 201) {
                setStatus("success");
            }
        } catch (error: any) {
            setStatus("idle");
            setError(error?.response?.data.message);
            console.log("Error in email waitlist:", error?.response?.data.message);
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    size={
                        text === "get early access" || text === "get early access now"
                            ? "lg"
                            : "default"
                    }
                    variant={text === "get early access now" ? "secondary" : "light"}
                    className={
                        text === "get early access" || text === "get early access now"
                            ? "text-lg font-medium"
                            : "text-sm capitalize"
                    }
                >
                    <p className="capitalize">{text}</p>
                    {icon === true ? (
                        <span>
                            <ArrowRight size={32} />
                        </span>
                    ) : null}
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[400px] sm:max-w-[425px] mx-auto w-full">
                {status === "success" ? (
                    <DialogHeader>
                        <div className="w-14 h-14 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                            <Check />
                        </div>
                        <DialogTitle className="text-center text-2xl font-bold text-slate-900">
                            You're on the list!
                        </DialogTitle>
                        <DialogDescription className="text-center text-slate-500">
                            We'll alert you the moment we launch. Get your PDFs ready!
                        </DialogDescription>

                        <DialogFooter className="mt-2">
                            <DialogClose asChild>
                                <Button
                                    size="icon-lg"
                                    variant="light"
                                    className="rounded-md w-full"
                                    type="button"
                                >
                                    Close
                                </Button>
                            </DialogClose>
                        </DialogFooter>
                    </DialogHeader>
                ) : (
                    <>
                        <DialogHeader>
                            <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">
                                <Send />
                            </div>
                            <DialogTitle className="text-center text-2xl font-bold text-slate-900">
                                Join the Waitlist
                            </DialogTitle>
                            <DialogDescription className="text-center text-slate-500">
                                Get early access and know first
                                <br />
                                when we launch.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-3">
                            <div className="grid gap-3">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="alex@gmail.com"
                                />
                                {error && (
                                    <p className="text-sm font-medium text-red-500 bg-red-100 py-2 pl-4 rounded-md border-l-4 border-red-500">
                                        {error}
                                    </p>
                                )}
                            </div>

                            <DialogFooter>
                                <Button
                                    type="submit"
                                    disabled={status === "submitting"}
                                    size="icon-lg"
                                    variant="light"
                                    className="rounded-md w-full"
                                >
                                    {status === "submitting" ? (
                                        <>
                                            <Loader2 className="animate-spin transition-all" />{" "}
                                            Joining...
                                        </>
                                    ) : (
                                        "Notify Me"
                                    )}
                                </Button>
                                <p className="text-[12px] text-center text-slate-400">
                                    By joining, you agree to receive product updates. No spam,
                                    ever.
                                </p>
                            </DialogFooter>
                        </form>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default WaitingListModal;
