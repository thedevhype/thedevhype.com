import Welcome from "@/lib/mail/welcome";
import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(request, response) {
  const { email, name } = await request.json();

  if (!email)
    return NextResponse.json({ ok: false, message: "Email is required" });

  const resend = new Resend(process.env.RESEND_API_KEY);

  const { data } = await resend.contacts.create({
    email,
    firstName: name,
    unsubscribed: false,
    audienceId: process.env.RESEND_TARGET_BROADCAST,
  });


  await resend.emails.send({
    from: "The Dev Hype <newsletter@mail.thedevhype.com>",
    to: email,
    subject: "Seja bem-vindo ao </hype>",
    react: Welcome(data.id),
  });


  return NextResponse.json(
    {
      ok: true,
      message: `Seu cadastro foi realizado com sucesso`,
      data,
    },
    { status: 200 }
  );
}

export async function GET(request, response) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
  
    if (!id)
      return NextResponse.json({ ok: false, message: "Email is required" });
  
    const resend = new Resend(process.env.RESEND_API_KEY);
  
    const { data } = await resend.contacts.remove({
      id,
      audienceId: "1fd01781-a7c8-4db7-a9c7-a7ef536d1946",
    });
  
    return NextResponse.redirect(`${baseUrl}/unsub`);
}