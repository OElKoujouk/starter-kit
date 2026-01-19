"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function RegisterPage() {
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulation
        setTimeout(() => setIsLoading(false), 1000);
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Inscription</CardTitle>
                    <CardDescription>
                        Créez votre compte pour commencer
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Input placeholder="Nom complet" required />
                        </div>
                        <div className="space-y-2">
                            <Input type="email" placeholder="nom@exemple.com" required />
                        </div>
                        <div className="space-y-2">
                            <Input type="password" placeholder="Mot de passe" required />
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4">
                        <Button type="submit" className="w-full btn-primary" disabled={isLoading}>
                            {isLoading ? "Création..." : "S'inscrire"}
                        </Button>
                        <p className="text-sm text-center text-slate-500">
                            Déjà un compte ?{" "}
                            <Link href="/login" className="text-blue-600 hover:underline">
                                Se connecter
                            </Link>
                        </p>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
