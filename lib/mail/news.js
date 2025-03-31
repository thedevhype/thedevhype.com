// /components/emails/TechNewsletterTemplate.jsx
import * as React from 'react';
import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';

const formatDate = (date) => {
  const options = { day: 'numeric', month: 'long', year: 'numeric' };
  return new Date(date).toLocaleDateString('pt-BR', options);
};

export const TechNewsletterTemplate = ({
  title,
  editionNumber = 1,
  date = new Date(),
  categories = [],
  emailAddress = 'usuario@exemplo.com',
}) => {
  // Processar todas as notícias de todos as categorias em uma lista única
  const allNews = categories.flatMap(category => 
    category.news.map(news => ({
      ...news,
      category: category.name
    }))
  );

  // Obter a notícia em destaque (primeira notícia da primeira categoria, ou a primeira notícia em geral)
  const featuredNews = allNews.length > 0 ? allNews[0] : null;
  
  // Restante das notícias
  const regularNews = allNews.slice(1);

  return (
    <Html>
      <Head />
      <Preview>thedevhype: O Essencial sobre tecnologia e inteligência artificial para quem só tem 5 minutos</Preview>
      <Tailwind>
        <Body className="bg-[#f4f4f4] font-sans py-[40px]">
          <Container className="max-w-[600px] mx-auto bg-white text-[#333333] rounded-[8px] overflow-hidden">
            {/* Header */}
            <Section className="border-b-[1px] border-[#e0e0e0] px-[24px] py-[32px]">
              <Row>
                <Column>
                  <Heading className="text-[28px] font-bold text-[#1a1a1a] m-0 leading-[32px]">
                    the<span className="text-[#0070f3]">dev</span>hype
                  </Heading>
                  <Text className="text-[14px] mt-[8px] mb-0 text-[#666666]">
                    O Essencial sobre tecnologia e inteligência artificial para quem só tem 5 minutos.
                  </Text>
                </Column>
                <Column className="text-right">
                  <Text className="text-[14px] text-[#666666] m-0">
                    {formatDate(date)}
                  </Text>
                </Column>
              </Row>
            </Section>

            {/* Introduction */}
            <Section className="px-[24px] py-[32px]">
              <Heading className="text-[22px] font-bold text-[#1a1a1a] m-0 mb-[16px]">
                {title || "Esta Semana em Tecnologia & IA"}
              </Heading>
              
              <Text className="text-[16px] mb-[24px] text-[#444444] leading-[24px]">
                Bem-vindo à nossa seleção semanal dos desenvolvimentos mais significativos em tecnologia e inteligência artificial. Nossa equipe editorial analisou as últimas inovações para trazer a você estas atualizações essenciais.
              </Text>

              {/* Featured News */}
              {featuredNews && (
                <Section className="bg-[#f8f9ff] border-l-[4px] border-[#0070f3] p-[16px] mb-[32px] rounded-[4px]">
                  <Row>
                    <Column>
                      <Text className="text-[18px] font-bold text-[#1a1a1a] m-0">
                        {featuredNews.title}
                      </Text>
                      <Text className="text-[15px] mt-[8px] mb-[6px] text-[#444444] leading-[22px] italic">
                        {featuredNews.subtitle}
                      </Text>
                      
                      <ul className="m-0 p-0 pl-[20px] mb-[16px]">
                        {featuredNews.points.map((point, index) => (
                          <li key={index} className="text-[14px] text-[#444444] leading-[22px] mb-[8px]">
                            {point.text}
                          </li>
                        ))}
                      </ul>
                      
                      <Text className="text-[12px] text-[#666666] mt-[16px] mb-[8px]">
                        Fontes:
                      </Text>
                      <Text className="text-[12px] text-[#666666] m-0 leading-[18px]">
                        {featuredNews.sources.map((source, index) => (
                          <React.Fragment key={index}>
                            <Link href={source.url} className="text-[#0070f3]">
                              {source.title}
                            </Link>
                            {index < featuredNews.sources.length - 1 && (
                              <span className="text-[#666666] ml-[4px]">• </span>
                            )}
                          </React.Fragment>
                        ))}
                      </Text>
                    </Column>
                  </Row>
                </Section>
              )}

              {/* Regular News */}
              {regularNews.map((news, newsIndex) => (
                <Section key={newsIndex} className="mb-[32px] pb-[24px] border-b-[1px] border-[#e0e0e0]">
                  <Text className="text-[18px] font-bold text-[#1a1a1a] m-0 mb-[8px]">
                    {news.title}
                  </Text>
                  <Text className="text-[15px] mb-[6px] text-[#444444] leading-[22px] italic">
                    {news.subtitle}
                  </Text>
                  
                  <ul className="m-0 p-0 pl-[20px] mb-[16px]">
                    {news.points.map((point, pointIndex) => (
                      <li key={pointIndex} className="text-[14px] text-[#444444] leading-[22px] mb-[8px]">
                        {point.text}
                      </li>
                    ))}
                  </ul>
                  
                  <Text className="text-[12px] text-[#666666] mt-[16px] mb-[8px]">
                    Fontes:
                  </Text>
                  <Text className="text-[12px] text-[#666666] m-0 leading-[18px]">
                    {news.sources.map((source, sourceIndex) => (
                      <React.Fragment key={sourceIndex}>
                        <Link href={source.url} className="text-[#0070f3]">
                          {source.title}
                        </Link>
                        {sourceIndex < news.sources.length - 1 && (
                          <span className="text-[#666666] ml-[4px]">• </span>
                        )}
                      </React.Fragment>
                    ))}
                  </Text>
                </Section>
              ))}
            </Section>

            {/* Footer */}
            <Section className="bg-[#f8f9fa] px-[24px] py-[24px] text-[#666666]">
              <Text className="text-[12px] m-0">
                © {new Date().getFullYear()} thedevhype. Todos os direitos reservados.
              </Text>
              <Text className="text-[12px] mt-[16px] mb-0">
                Este email foi enviado para {emailAddress}. 
                <Link href="{{{RESEND_UNSUBSCRIBE_URL}}}" className="text-[#0070f3] ml-[4px]">
                  Cancelar inscrição
                </Link> • 
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default TechNewsletterTemplate;