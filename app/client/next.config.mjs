/** @type {import('next').NextConfig} */
const nextConfig = {
    // Activer les Server Actions
    experimental: {
        serverActions: {
            bodySizeLimit: "2mb",
        },
    },

    // Variables d'environnement exposées au client
    env: {
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api",
    },

    // Désactiver les headers X-Powered-By
    poweredByHeader: false,

    // Redirection trailing slash
    trailingSlash: false,
};

export default nextConfig;
