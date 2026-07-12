


import { Resend } from 'resend';
import config from '../config';


const resend = new Resend(config.resend_api_key as string);

interface ISendEmail {
    to: string;
    subject: string;
    html: string;
}

export const sendEmail = async ({ to, subject, html }: ISendEmail) => {
    try {
        const data = await resend.emails.send({

            from: 'Acme <onboarding@resend.dev>',
            to: [to],
            subject: subject,
            html: html,
        });



        return data;
    } catch (error) {
        console.error('Failed to send email:', error);
        throw new Error('Email sending failed');
    }
};