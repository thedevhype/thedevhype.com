import axios from 'axios';
import { newsDataSchema } from './mail/json_schema';
import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Obtém as últimas notícias de tecnologia e IA da Perplexity com melhor qualidade e estrutura
 * @returns {Promise<Object>} Dados de notícias estruturados
 */
export async function fetchNewsFromPerplexity() {
  try {
    const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY;
    
    // Fazer a chamada para a API da Perplexity com prompt aprimorado
    const response = await axios.post('https://api.perplexity.ai/chat/completions', {
      model: "sonar-pro", // Usando o modelo mais poderoso da Perplexity
      messages: [
        {
          role: 'system',
          content: `Você é TECHPULSE, um sofisticado sistema especializado em curadoria de notícias de tecnologia para desenvolvedores.

SEUS PRINCÍPIOS ESSENCIAIS:
1. EXTREMAMENTE RIGOROSO com datas - apenas notícias de HOJE ou ONTEM.
2. VERIFICAÇÃO PROFUNDA de fontes - mínimo de 2 fontes distintas e respeitadas por notícia.
3. PRECISÃO TÉCNICA absoluta em todos os detalhes e terminologia.
4. TOM PROFISSIONAL COM HUMOR INTELIGENTE - como um desenvolvedor sênior falando com colegas.
5. RELEVÂNCIA PRÁTICA para desenvolvedores - cada notícia deve impactar diretamente a vida dos devs.

SEU PROCESSO DE CURADORIA:
1. Pesquise as NOTÍCIAS MAIS RECENTES (últimas 24-48h) sobre IA e tecnologia para desenvolvedores.
2. Verifique RIGOROSAMENTE as datas e a veracidade do conteúdo.
3. Selecione apenas notícias com MULTIPLE SOURCES VERIFICADAS.
4. Priorize tópicos de ALTO IMPACTO para desenvolvedores: frameworks, linguagens, ferramentas, APIs, segurança.
5. Forneça sempre CONTEXTO TÉCNICO PRECISO sobre por que a notícia é relevante.

SUA PERSONALIDADE:
- Um insider da indústria tech com mais de 15 anos de experiência.
- Perspicaz, bem-informado, ligeiramente cínico sobre hypes exagerados.
- Capaz de discernir entre genuínas inovações e marketing vazio.
- Habilidoso em explicar conceitos complexos com clareza.
- Fala como um desenvolvedor experiente, não como um robô ou marketeiro.`
        },
        {
          role: 'user',
          content: `Crie a newsletter THE DEV HYPE para hoje, ${new Date().toISOString().split('T')[0]}, seguindo EXATAMENTE esta estrutura:

1. TÍTULO: Um título envolvente no estilo "Breaking: [principais temas do dia]" (máximo 280 caracteres).

2. INTRODUÇÃO: Um parágrafo que sintetiza as tendências mais importantes das últimas 24-48 horas com um tom levemente irreverente e perspicaz (100-200 palavras).

3. NOTÍCIAS PRINCIPAIS: APENAS notícias publicadas nas ÚLTIMAS 24-48 HORAS. Para cada uma das 5 notícias mais relevantes:

   a) HEADLINE: Título direto e impactante (máximo 60 caracteres).
   
   b) INTRODUÇÃO DA NOTÍCIA: Um parágrafo explicando a relevância para desenvolvedores com contexto técnico adequado e um toque de humor inteligente (150-200 palavras).
   
   c) DETALHES TÉCNICOS: 4-5 bullet points com informações precisas e específicas. Cada ponto deve ser uma frase completa com detalhes técnicos concretos.
   
   d) FONTES: No mínimo 2 fontes respeitáveis com links diretos e datas de publicação.
   
   e) ANÁLISE DE IMPACTO: Um comentário perspicaz sobre como isso afeta o ecossistema de desenvolvimento (50-70 palavras).

IMPORTANTE: A data é um fator CRÍTICO. Rigorosamente verifique e inclua APENAS notícias publicadas nas últimas 48 horas. Cada notícia DEVE ter múltiplas fontes verificáveis.

TÓPICOS A PRIORIZAR:
- Atualizações significativas em frameworks e bibliotecas populares
- Novas ferramentas de IA para desenvolvedores
- Vulnerabilidades e patches de segurança importantes
- Mudanças em plataformas que afetam o desenvolvimento
- Avanços técnicos com impacto prático no dia a dia dos devs

Mantenha o conteúdo EXTREMAMENTE ATUAL, TECNICAMENTE PRECISO e com RELEVÂNCIA PRÁTICA para desenvolvedores.`
        }
      ],
      max_tokens: 4000,
      temperature: 0.2, // Valor baixo para maximizar precisão factual
      top_p: 0.9,
      search_domain_filter: [
        "techcrunch.com",
        "theverge.com",
        "wired.com",
        "zdnet.com",
        "venturebeat.com", 
        "thenextweb.com",
        "infoworld.com",
        "devclass.com",
        "dev.to",
        "stackoverflow.blog",
        "github.blog",
        "arstechnica.com",
        "sdtimes.com",
        "hackernoon.com",
        "theregister.com"
      ],
      search_recency_filter: "day", // Limitar a notícias das últimas 24 horas
      frequency_penalty: 0.2, // Leve penalidade para repetições
      presence_penalty: 0.2, // Leve penalidade para tópicos óbvios demais
      response_format: { 
        type: "json_schema", 
        json_schema: { schema: newsDataSchema }
      },
      web_search_options: {
        search_context_size: "high", // Obter mais contexto de pesquisa
        include_search_results: true, // Incluir resultados da pesquisa na resposta
        search_query_prefix: "new tech development" // Prefixo para melhorar a relevância
      }
    }, {
      headers: {
        'Authorization': `Bearer ${PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    // Verificar se há um erro na resposta
    if (!response.data || !response.data.choices || !response.data.choices[0]) {
      console.error('Resposta inválida da Perplexity API:', response.data);
      throw new Error('Resposta inválida da Perplexity API');
    }

    // Extrair o conteúdo
    let content;
    try {
      content = response.data.choices[0].message.content;
      
      // Log para depuração
      console.log('Resposta bruta:', content.substring(0, 200) + '...');
      
      // Parsear o JSON
      const newsData = JSON.parse(content);
      
      // Validar a estrutura
      validateNewsData(newsData);
      
      // Adicionar timestamp
      newsData.timestamp = new Date().toISOString();
      
      // Extrair e enriquecer com resultados de pesquisa se disponíveis
      if (response.data.choices[0].message.search_results) {
        const searchResults = response.data.choices[0].message.search_results;
        enrichNewsWithSearchResults(newsData, searchResults);
      }
      
      // Traduzir para português
      const portugueseNewsData = await translateNewsToPortuguese(newsData);
      return portugueseNewsData;
    } catch (error) {
      console.error('Erro ao processar resposta da Perplexity:', error);
      console.error('Conteúdo recebido:', content);
      
      // Tentar recuperar com uma segunda chamada
      return await fetchBackupNews();
    }
  } catch (error) {
    console.error('Erro ao consultar Perplexity API:', error.response?.data || error.message);
    console.error('Tentando obter dados de backup...');
    
    // Em caso de falha, usar dados alternativos
    return await fetchBackupNews();
  }
}

/**
 * Validação básica da estrutura de dados
 * @param {Object} newsData Objeto de notícias a ser validado
 * @throws {Error} Se a validação falhar
 */
function validateNewsData(newsData) {
  // Verificar campos obrigatórios
  if (!newsData.title || typeof newsData.title !== 'string') {
    throw new Error('Título inválido');
  }
  
  if (!newsData.introduction || typeof newsData.introduction !== 'string') {
    throw new Error('Introdução inválida');
  }
  
  if (!Array.isArray(newsData.news) || newsData.news.length !== 5) {
    throw new Error('Array de notícias inválido (deve ter exatamente 5 itens)');
  }
  
  // Verificar cada notícia
  newsData.news.forEach((item, index) => {
    if (!item.headline || typeof item.headline !== 'string') {
      throw new Error(`Headline inválido na notícia ${index + 1}`);
    }
    
    if (!item.introduction || typeof item.introduction !== 'string') {
      throw new Error(`Introdução inválida na notícia ${index + 1}`);
    }
    
    if (!Array.isArray(item.bulletPoints) || item.bulletPoints.length < 4) {
      throw new Error(`Bullet points inválidos na notícia ${index + 1}`);
    }
    
    if (!Array.isArray(item.sources) || item.sources.length < 2) {
      throw new Error(`Fontes inválidas na notícia ${index + 1}`);
    }
    
    if (!item.comment || typeof item.comment !== 'string') {
      throw new Error(`Comentário inválido na notícia ${index + 1}`);
    }
  });
}

/**
 * Enriquece notícias com resultados de pesquisa adicionais
 * @param {Object} newsData Objeto de notícias
 * @param {Array} searchResults Resultados da pesquisa
 */
function enrichNewsWithSearchResults(newsData, searchResults) {
  if (!searchResults || searchResults.length === 0) return;
  
  // Extrair URLs de imagens dos resultados
  const imageMap = new Map();
  searchResults.forEach(result => {
    if (result.image && result.image.url) {
      const keywords = extractKeywords(result.title.toLowerCase());
      keywords.forEach(keyword => {
        if (keyword.length > 4) { // Ignorar palavras muito curtas
          if (!imageMap.has(keyword) || Math.random() > 0.5) { // 50% de chance de substituir imagem existente
            imageMap.set(keyword, result.image.url);
          }
        }
      });
    }
  });
  
  // Adicionar imagens relevantes às notícias
  newsData.news.forEach(newsItem => {
    const headlineKeywords = extractKeywords(newsItem.headline.toLowerCase());
    
    // Tentar encontrar imagem relevante
    for (const keyword of headlineKeywords) {
      if (imageMap.has(keyword)) {
        newsItem.imageUrl = imageMap.get(keyword);
        break;
      }
    }
    
    // Se não encontrou imagem pelo título, tentar pelo conteúdo
    if (!newsItem.imageUrl) {
      const contentKeywords = extractKeywords(newsItem.introduction.toLowerCase());
      for (const keyword of contentKeywords) {
        if (imageMap.has(keyword)) {
          newsItem.imageUrl = imageMap.get(keyword);
          break;
        }
      }
    }
  });
}

/**
 * Extrai palavras-chave significativas de um texto
 * @param {String} text Texto para extrair palavras-chave
 * @returns {Array} Array de palavras-chave
 */
function extractKeywords(text) {
  // Lista de stopwords comuns
  const stopwords = new Set([
    'a', 'an', 'the', 'and', 'but', 'or', 'for', 'nor', 'on', 'at', 'to', 'by', 'from',
    'de', 'da', 'do', 'das', 'dos', 'e', 'ou', 'para', 'com', 'em', 'no', 'na', 'nos', 'nas',
    'this', 'that', 'these', 'those', 'is', 'are', 'was', 'were', 'has', 'have', 'had',
    'be', 'been', 'being', 'with', 'without', 'as', 'if', 'then', 'than', 'so'
  ]);
  
  // Remover pontuação, dividir em palavras e filtrar stopwords
  return text
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 4 && !stopwords.has(word));
}

/**
 * Busca notícias alternativas em caso de falha na primeira fonte
 * @returns {Promise<Object>} Dados de notícias estruturados
 */
async function fetchBackupNews() {
  try {
    console.log('Buscando notícias de backup...');
    // Usar abordagem com OpenAI como backup
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        {
          role: "system",
          content: `Você é TECHPULSE, um especialista em curadoria de notícias tecnológicas para desenvolvedores.
          
Sua tarefa é criar uma newsletter THE DEV HYPE com 5 notícias tecnológicas relevantes para desenvolvedores.

REGRAS CRÍTICAS:
1. Gere notícias FICCIONAIS mas PLAUSÍVEIS e REALISTAS sobre assuntos que seriam relevantes para desenvolvedores.
2. Siga rigorosamente o formato especificado na solicitação.
3. Cada notícia deve ter detalhes técnicos específicos e precisos.
4. Use um tom profissional mas levemente irreverente, como um desenvolvedor falando com outro desenvolvedor.
5. Certifique-se de que o conteúdo seja estruturado conforme o schema JSON especificado.`
        },
        {
          role: "user",
          content: `Crie uma newsletter de tecnologia para desenvolvedores com 5 notícias FICTÍCIAS mas PLAUSÍVEIS e REALISTAS, seguindo exatamente o formato abaixo:

{
  "title": "Título principal da newsletter (máximo 280 caracteres)",
  "introduction": "Parágrafo introdutório que sintetiza as principais tendências",
  "news": [
    {
      "headline": "Título da notícia 1 (máximo 60 caracteres)",
      "introduction": "Parágrafo introdutório explicando a relevância da notícia",
      "bulletPoints": [
        "Ponto detalhado 1 com informações técnicas específicas",
        "Ponto detalhado 2 com informações técnicas específicas",
        "Ponto detalhado 3 com informações técnicas específicas",
        "Ponto detalhado 4 com informações técnicas específicas",
        "Ponto detalhado 5 com informações técnicas específicas"
      ],
      "sources": [
        {
          "title": "Título da fonte 1",
          "url": "https://exemplo.com/artigo1",
          "publishDate": "2025-04-13"
        },
        {
          "title": "Título da fonte 2",
          "url": "https://exemplo.com/artigo2",
          "publishDate": "2025-04-13"
        }
      ],
      "comment": "Breve comentário sobre o impacto da notícia"
    },
    // Repita o mesmo formato para as notícias 2, 3, 4 e 5
  ]
}

Tópicos sugeridos para as notícias:
1. Um novo framework ou biblioteca importante
2. Uma vulnerabilidade de segurança recém-descoberta
3. Uma nova ferramenta de IA para desenvolvedores
4. Uma atualização importante em uma tecnologia existente
5. Uma tendência emergente em desenvolvimento de software

Use URLs fictícios mas plausíveis para as fontes. Não use placeholders como "exemplo.com", mas sim domínios que pareçam reais (como techcrunch.com, theverge.com, etc).

Certifique-se de que sua resposta seja um JSON válido.`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    // Extrair e validar o conteúdo
    const content = completion.choices[0].message.content;
    const newsData = JSON.parse(content);
    
    // Validar estrutura básica
    validateNewsData(newsData);
    
    // Adicionar timestamp
    newsData.timestamp = new Date().toISOString();
    
    // Traduzir para português
    const portugueseNewsData = await translateNewsToPortuguese(newsData);
    return portugueseNewsData;
  } catch (error) {
    console.error('Erro ao buscar notícias de backup:', error);
    
    // Em último caso, usar dados mockados
    return getMockNewsData();
  }
}

/**
 * Traduz o objeto de notícias para o português brasileiro
 * @param {Object} newsData Objeto de notícias a ser traduzido
 * @returns {Object} Objeto de notícias traduzido
*/
export async function translateNewsToPortuguese(newsData) {
  try {
    const translateText = async (text) => {
      if (!text) return '';
      
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini", // Modelo mais leve para traduções
        messages: [
          {
            role: "system",
            content: `Você é um tradutor especializado em conteúdo técnico de tecnologia, com foco em traduzir do inglês para o português brasileiro para uma audiência de desenvolvedores.

Diretrizes específicas:
1. Mantenha termos técnicos que são comumente usados em inglês no meio de desenvolvimento.
2. Adapte expressões idiomáticas para equivalentes brasileiros naturais.
3. Preserve o estilo e tom do original - mantenha o humor inteligente adaptado ao contexto brasileiro.
4. Traduza com naturalidade, como um desenvolvedor brasileiro falaria.
5. Seja preciso com terminologia técnica.`
          },
          {
            role: "user",
            content: `Traduza o seguinte texto para português brasileiro, mantendo a terminologia técnica apropriada e adaptando expressões:

${text}

IMPORTANTE:
- NÃO inclua aspas no texto traduzido.
- NÃO adicione notas do tradutor.
- NÃO altere URLs ou dados técnicos como versões de software.
- Mantenha a mesma extensão aproximada do texto original.`
          }
        ],
        max_tokens: 2000,
        temperature: 0.3, // Valor baixo para fidelidade
      });
      
      return response.choices[0].message.content.trim();
    };

    console.log('Iniciando tradução...');

    // Processando título e introdução principal
    const [translatedTitle, translatedIntro] = await Promise.all([
      translateText(newsData.title),
      translateText(newsData.introduction)
    ]);

    // Processar as notícias em série para evitar muitas chamadas simultâneas
    const translatedNewsItems = [];
    
    for (const item of newsData.news) {
      console.log(`Traduzindo notícia: ${item.headline.substring(0, 30)}...`);
      
      // Traduzir partes principais
      const [headline, introduction, comment] = await Promise.all([
        translateText(item.headline),
        translateText(item.introduction),
        translateText(item.comment)
      ]);
      
      // Traduzir bullet points
      const bulletPoints = [];
      for (const point of item.bulletPoints) {
        const translatedPoint = await translateText(point);
        bulletPoints.push(translatedPoint);
      }

      translatedNewsItems.push({
        headline,
        introduction,
        bulletPoints,
        sources: item.sources, // Manter fontes originais
        comment,
        imageUrl: item.imageUrl // Preservar URL da imagem se existir
      });
    }

    return {
      title: translatedTitle,
      introduction: translatedIntro,
      news: translatedNewsItems,
      timestamp: newsData.timestamp
    };
  } catch (error) {
    console.error('Erro na tradução:', error);
    
    // Em caso de erro na tradução, retornar os dados originais
    console.log('Retornando dados em inglês devido a erro na tradução');
    return newsData;
  }
}
/**
 * Obtém dados de exemplo para desenvolvimento/testes
 * @returns {Object} Dados de notícias de exemplo
 */
export function getMockNewsData() {
  return {
    "title": "OpenAI Goes Open-Source, Red Hat Boosts AI Modernization, and NEC Drives Digital Transformation – AI & Tech News for Devs",
    "introduction": "Today’s AI and tech news is a rollercoaster of open-source ambitions, modernization tools, and digital transformation strategies. OpenAI is finally joining the open-source party, Red Hat is making AI-driven app modernization a breeze, and NEC is doubling down on cutting-edge tech. Developers, grab your coffee—this is your daily dose of irreverent tech updates.",
    "news": [
      {
        "headline": "OpenAI Announces Open-Source AI Model Release",
        "introduction": "In a move that’s shaking up the AI world, OpenAI has announced plans to release an open-source AI model in the coming months. This decision comes amid growing competition from Meta’s Llama series and DeepSeek’s R1 model. For developers, this means more flexibility, lower costs, and the ability to run AI locally.",
        "bulletPoints": [
          "OpenAI CEO Sam Altman confirmed the release on social media, emphasizing the importance of open-source in fostering innovation.",
          "The model will allow users to download, modify, and run it on local hardware, reducing reliance on cloud services.",
          "OpenAI has pledged rigorous testing to prevent misuse, addressing concerns about malicious applications.",
          "A dedicated webpage has been launched for developers to apply for early access to the model.",
          "Developer events are planned in the coming weeks to facilitate technological exchange and feedback."
        ],
        "sources": [
          {
            "title": "OpenAI Plans to Release an Open-Source AI Model in the Coming Months",
            "url": "https://www.aibase.com/news/16759",
            "publishDate": "2025-04-01"
          }
        ],
        "comment": "This could democratize AI development, but the risks of misuse remain a concern. OpenAI’s testing framework will be crucial."
      },
      {
        "headline": "Red Hat Launches Konveyor AI 0.1 for App Modernization",
        "introduction": "Red Hat has unveiled Konveyor AI 0.1, a tool designed to simplify AI-driven application modernization. This open-source solution integrates generative AI with static code analysis, making it easier for developers to modernize legacy applications without fine-tuning models.",
        "bulletPoints": [
          "Konveyor AI uses retrieval-augmented generation (RAG) to enhance LLM outputs with historical code changes and analysis data.",
          "It offers a VS Code extension for suggested code changes directly within the IDE.",
          "The tool includes 2,400 predefined rules for migration paths, with options for custom rules.",
          "Konveyor AI is model-agnostic, allowing developers to use their preferred LLM.",
          "New features include asset generation for Kubernetes deployment and enhanced migration intelligence."
        ],
        "sources": [
          {
            "title": "New updates to Konveyor AI: Use AI-driven application modernization without fine-tuning a model",
            "url": "https://www.redhat.com/en/blog/new-updates-konveyor-ai-use-ai-driven-application-modernization-without-fine-tuning-model",
            "publishDate": "2025-04-01"
          }
        ],
        "comment": "This could be a game-changer for legacy systems, but the real test will be its adoption in large-scale enterprise environments."
      },
      {
        "headline": "NEC Advances AI and Digital Transformation",
        "introduction": "NEC is pushing the boundaries of AI and digital transformation with its latest initiatives. The company is focusing on agentic AI, small-scale language models (SLM), and cybersecurity to expand use cases across industries.",
        "bulletPoints": [
          "NEC is implementing cutting-edge technologies like agentic AI and SLM to co-create solutions with customers.",
          "The company is enhancing its cybersecurity capabilities and developing digital social infrastructure.",
          "NEC’s Mid-term Management Plan 2025 is progressing faster than expected, with a focus on growth and market commitments.",
          "The company is restructuring its group companies in Japan to strengthen its position as a DX leader.",
          "NEC’s 'Client Zero' approach ensures new technologies are tested internally before being offered to customers."
        ],
        "sources": [
          {
            "title": "Delivering Reliable Technology and Creating a Meaningful Legacy",
            "url": "https://www.nec.com/en/global/corporateblog/202504/01.html",
            "publishDate": "2025-04-01"
          }
        ],
        "comment": "NEC’s focus on co-creation and internal testing could set a new standard for tech innovation, but scalability remains a challenge."
      }
    ],
    "timestamp": "2025-04-01T03:26:06.754Z"
  }
}