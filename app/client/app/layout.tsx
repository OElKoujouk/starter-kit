import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
    title: "Starter Kit",
    description: "Full-stack starter kit with Next.js, Express, Prisma and Tailwind",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="fr">
            <head>
                <link
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
                    rel="stylesheet"
                />
            </head>
            <body>
                {children}
                <Toaster
                    position="top-right"
                    toastOptions={{
                        style: {
                            background: "white",
                            border: "1px solid #e2e8f0",
                            borderRadius: "12px",
                        },
                    }}
                />
            </body>
        </html>
    );
}
