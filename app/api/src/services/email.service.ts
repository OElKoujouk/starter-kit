import nodemailer from "nodemailer";
import { env, logger } from "../config";

/**
 * Service d'emailing abstrait.
 * Supporte : Console (dev), SMTP, et peut être étendu pour Resend/Sendgrid.
 */

interface SendEmailOptions {
    to: string;
    subject: string;
    text?: string;
    html?: string;
}

class EmailService {
    private transporter: any;

    constructor() {
        this.initTransporter();
    }

    private initTransporter() {
        if (env.EMAIL_PROVIDER === "smtp") {
            this.transporter = nodemailer.createTransport({
                host: env.SMTP_HOST,
                port: env.SMTP_PORT,
                auth: {
                    user: env.SMTP_USER,
                    pass: env.SMTP_PASS,
                },
            });
            logger.info("EmailService: Initialisé avec SMTP");
        } else if (env.EMAIL_PROVIDER === "console") {
            this.transporter = {
                sendMail: async (options: any) => {
                    logger.info(`[EMAIL CONSOLE] De: ${options.from}`);
                    logger.info(`Pour: ${options.to}`);
                    logger.info(`Sujet: ${options.subject}`);
                    logger.info(`Body: ${options.text || options.html}`);
                    return { messageId: "console-id" };
                },
            };
            logger.info("EmailService: Initialisé en mode CONSOLE");
        }
        // Possibilité d'ajouter Resend ici
    }

    async sendEmail(options: SendEmailOptions) {
        try {
            const info = await this.transporter.sendMail({
                from: env.EMAIL_FROM,
                to: options.to,
                subject: options.subject,
                text: options.text,
                html: options.html,
            });
            logger.info(`Email envoyé avec succès: ${info.messageId}`);
            return info;
        } catch (error) {
            logger.error("Erreur lors de l'envoi de l'email:", error);
            throw error;
        }
    }

    /**
     * Exemple de template : Welcome Email
     */
    async sendWelcomeEmail(to: string, name: string) {
        return this.sendEmail({
            to,
            subject: `Bienvenue sur ${name} !`,
            html: `<h1>Bienvenue, ${name} !</h1><p>Nous sommes ravis de vous compter parmi nous.</p>`,
        });
    }
}

export const emailService = new EmailService();
