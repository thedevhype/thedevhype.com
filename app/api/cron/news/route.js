
import axios from 'axios';
import TechNewsletterTemplate from '@/lib/mail/news';
import { render } from '@react-email/render';
import { fetchNewsFromPerplexity } from '@/lib/perplexity';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);


export async function GET(request) {
  try {
    // Verificar autenticação
    const { searchParams } = new URL(request.url);
    const apiKey = searchParams.get('apiKey');
    const editionNumber = searchParams.get('edition') || 1;
    const useMockData = searchParams.get('mock') === 'true';

    if (apiKey !== process.env.NEWSLETTER_API_KEY) {
      return Response.json(
        { error: 'Acesso não autorizado' },
        { status: 401 }
      );
    }

    // Obter dados (mock ou real)
    const newsData = useMockData ? getMockNewsData() : await fetchNewsFromPerplexity();

    // Renderizar o template React Email com os dados
    const emailHtml = await render(
      <TechNewsletterTemplate 
        title={newsData.title}
        editionNumber={editionNumber}
        date={new Date()}
        categories={newsData.categories}
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

    // Retornar HTML diretamente
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