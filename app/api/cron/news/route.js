import TechNewsletterTemplate from '@/lib/mail/news';
import { render } from '@react-email/render';
import { fetchNewsFromPerplexity, getMockNewsData } from '@/lib/perplexity';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);


export async function GET(request) {
  try {
    // Verificar autenticação
    const { searchParams } = new URL(request.url);
    const apiKey = searchParams.get('apiKey');
    
    const useMockData = searchParams.get('mock') === 'true';

    if (apiKey !== process.env.NEWSLETTER_API_KEY) {
      return Response.json(
        { error: 'Acesso não autorizado' },
        { status: 401 }
      );
    }

    // Obter dados (mock ou real)
    const newsData = useMockData ? getMockNewsData() : await fetchNewsFromPerplexity();
    const {data: {data}} =  await resend.broadcasts.list();
    const editionNumber = (data.length || 0) + 1;
    const {news} = newsData

    // Renderizar o template React Email com os dados
    const emailHtml = await render(
      <TechNewsletterTemplate 
        title={newsData.title}
        editionNumber={editionNumber}
        date={new Date()}
        news={news}
        emailAddress="preview@example.com"
      />
    );

    const { id } = await resend.broadcasts.create({
      audienceId: process.env.RESEND_TARGET_BROADCAST,
      from: 'News <noreply@thedevhype.com>',
      subject: newsData.title,
      html: emailHtml,
    });
    
    await resend.broadcasts.send(id, {
      scheduledAt: 'in 1 min',
    });

    // // Retornar HTML diretamente
    // return new Response(emailHtml, {
    //   headers: { 'Content-Type': 'text/html' },
    //   status: 200
    // });

    return Response.json(
      { success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erro ao gerar prévia da newsletter:', error);
    
    return Response.json(
      { 
        error: 'Falha ao gerar prévia da newsletter',
        message: error.message 
      },
      { status: 500 }
    );
  }
}