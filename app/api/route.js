import { Resend } from 'resend';
const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET(request) {
    const {data: {data}} =  await resend.broadcasts.list();
    console.log(data)
}