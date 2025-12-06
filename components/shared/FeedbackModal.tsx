"use client";

import { useState } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import toast from "react-hot-toast";

const FeedbackModal = () => {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!message.trim()) {
            toast.error("Say something 🥺");
            return;
        }

        try {
            setLoading(true);

            const res = await fetch("/api/feedback", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ message }),
            });

            if (!res.ok) {
                throw new Error("Failed to send feedback");
            }

            toast.success("Feedback submitted 🥳");
            setMessage("");

            setTimeout(() => {
                setOpen(false);
            }, 1200);
        } catch (error) {
            toast.error("Something went wrong 😓");
        } finally {
            setLoading(false);
        }
    };
    return (
        <>
            <Button size="default" className="text-sm" onClick={() => setOpen(true)}>
                Give Feedback
            </Button>

            {open && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <Card className="w-[550px] p-6">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-0.5">
                                <h2 className="text-lg font-semibold text-accent-foreground">
                                    Your Feedback
                                </h2>

                                <p className="text-sm text-accent-foreground">
                                    Tell us what's on your mind
                                </p>
                            </div>
                            <div className="space-y-2">
                                <Input
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="New features? Any issues?"
                                />
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
                                <Button
                                    variant="outline"
                                    className="text-sm"
                                    onClick={() => setOpen(false)}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" className="text-sm">
                                    {loading ? "Sending..." : "Submit"}
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>
            )}
        </>
    );
};

export default FeedbackModal;
