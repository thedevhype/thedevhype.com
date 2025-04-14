import {
    Body,
    Container,
    Column,
    Head,
    Heading,
    Hr,
    Html,
    Row,
    Section,
    Text,
    Link
  } from "@react-email/components";
  import { Tailwind } from "@react-email/tailwind";
  
  import * as React from "react";
  
  export const Welcome = ({
    userId,
  }) => {
    return (
      <Html>
        <Tailwind>
        <Head />
        <Body className="bg-white my-auto mx-auto font-sans px-2">
          <Container className="my-[40px] mx-auto p-[20px] max-w-[600px] bg-white">
            <Heading className="font-normal text-center p-0 my-[30px] mx-0">
              <Link className="text-black" href={"https://thedevhype.com?utm_source=newsletter&utm_medium=email"}>{'< The Dev Hype />'}</Link>
            </Heading>
            
            <Text className="text-[24px] text-center text-black">
              {"O Essencial sobre tecnologia e inteligência artificial para quem só tem 5 minutos."}
            </Text>
            
            <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
            
            <Section className="bg-white px-0 py-5">
              <Row>
                <Column>
                  <Text className="text-[18px] font-bold">
                    {`Parabéns, você acaba de entrar para o grupo de desenvolvedores que entendem: IA não é hobby, é parte fundamental da nossa profissão.`}
                  </Text>
                  <Text className="text-[16px]">
                    {`The Dev Hype nasceu de uma necessidade real: como filtrar o bombardeio diário de notícias sobre IA e tecnologia para extrair apenas o que realmente importa para nossa carreira? Porque sabemos que ficar atualizado sobre IA e tecnologia…`}
                  </Text>
                  <Text className="text-[16px] ml-4 mt-3">
                    <strong>Não precisa ser massante</strong>, pode ser objetivo
                  </Text>
                  <Text className="text-[16px] ml-4 mt-1">
                    <strong>Não precisa tomar seu dia todo</strong>, pode levar só 5 minutos
                  </Text>
                  <Text className="text-[16px] ml-4 mt-1">
                    <strong>Não precisa ser em inglês</strong>, pode ser em português claro
                  </Text>
                  <Text className="text-[16px] ml-4 mt-1">
                    <strong>Não precisa ser superficial</strong>, pode ter profundidade técnica
                  </Text>
                  <Text className="text-[16px] ml-4 mt-1">
                    <strong>Não precisa estar disperso em mil fontes</strong>, pode estar no seu inbox
                  </Text>
                  <Text className="text-[16px] mt-6">
                    {`Chegaremos no seu inbox todas as manhãs, pontualmente às 9h, enquanto você toma aquele café antes do daily.`}
                  </Text>
                </Column>
              </Row>
            </Section>
            
            <Section className="bg-white px-0 py-5">
              <Row>
                <Column>
                  <Text className="text-[18px] font-bold">
                    {`Para garantir que nunca caiamos na terra de ninguém (a temida pasta de SPAM), posso te pedir uma moral?`}
                  </Text>
                  <Text className="text-[16px] font-bold">
                    {`Basta responder esse email!`}
                  </Text>
                  <Text className="text-[16px]">
                    {`Pode ser qualquer coisa! Um "olá", sua opinião sobre como a IA está impactando seu trabalho, ou até mesmo quais tópicos você gostaria de ver mais. Seu e-mail vai direto para mim (Lucian) e prometo responder cada um pessoalmente.`}
                  </Text>
                  <Text className="text-[16px] mt-2">
                    {`Esse pequeno gesto ajuda MUITO a garantir que nossos próximos e-mails não sejam bloqueados pelo filtro do seu provedor. E é uma ótima forma de começarmos uma conversa sobre como podemos tornar o The Dev Hype ainda mais útil para sua rotina profissional.`}
                  </Text>
                </Column>
              </Row>
            </Section>
            
            <Section className="bg-white px-0 py-5">
              <Row>
                <Column>
                  <Text className="text-[16px]">
                    {`Como desenvolvedores, sabemos que a IA está transformando nossa profissão a cada dia. Nosso objetivo é separar o sinal do ruído e entregar a você apenas o que realmente vai impactar sua carreira e suas decisões técnicas.`}
                  </Text>
                  <Text className="text-[16px] mt-4">
                    {`Como projeto que está só começando, cada pessoa conta! Se esse conteúdo vai agregar valor à sua vida profissional, estas são as melhores formas de nos apoiar:`}
                  </Text>
                </Column>
              </Row>
              <Row>
                <Column>
                  <Text className="text-[16px] mt-2">
                    <strong>1. Responda este e-mail</strong> - além de evitar o SPAM, seu feedback nos ajuda a moldar o conteúdo para atender melhor às necessidades de desenvolvedores como você.
                  </Text>
                  <Text className="text-[16px] mt-2">
                    <strong>2. Compartilhe com colegas de profissão</strong> - Conhece outros devs que precisam se manter atualizados sobre IA? O The Dev Hype é aquela leitura técnica essencial de 5 minutos que entrega valor real à carreira. Compartilhe via {" "}
                    <Link href={`https://api.whatsapp.com/send?text=${encodeURI(`Acabei de me inscrever no The Dev Hype! Uma newsletter com conteúdo essencial sobre IA e tecnologia em apenas 5 minutos de leitura. Para devs que entendem que IA não é hobby, é parte da profissão: https://thedevhype.com`)}`}>
                      WhatsApp
                    </Link>, <Link href={`https://twitter.com/intent/post?text=${encodeURI("Para devs que entendem que IA não é hobby, é parte da profissão. The Dev Hype - conteúdo essencial em 5 minutos:")}&url=${encodeURI("https://thedevhype.com")}`}>Twitter</Link> {" "} ou {" "} <Link href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURI("https://thedevhype.com")}`}>LinkedIn</Link>.
                  </Text>
                  <Text className="text-[16px] mt-2">
                    <strong>3. Dê feedback técnico</strong> - O que podemos melhorar na curadoria? Quais tópicos são mais relevantes para seu dia a dia como desenvolvedor?
                  </Text>
                  <Text className="text-[16px] mt-4">
                    {`Estamos juntos nessa jornada de navegação pelo futuro da nossa profissão.`}
                  </Text>
                  <Text className="text-[16px] mt-4">
                    {`Lucian Fialho`}<br />
                    {`Fundador do The Dev Hype`}
                  </Text>
                </Column>
              </Row>
            </Section>
            
            <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
            <Text className="text-[#666666] text-[12px] leading-[24px]">
              P.S.: Se preferir não receber nossas newsletters, <Link href={`https://thedevhype.com/api/unsubscribe?id=${userId}`}>{`clique aqui`}</Link>. 
              Mas esperamos que você fique - estamos comprometidos em entregar conteúdo que realmente faça diferença na sua carreira.
            </Text>
          </Container>
        </Body>
        </Tailwind>
      </Html>
    );
  };
  
  Welcome.PreviewProps = {
    userId: "12345"
  };
  
  export default Welcome;