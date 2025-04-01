// /lib/perplexity-service.js
import axios from 'axios';
import { newsDataSchema } from './mail/json_schema';
import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Obtém as últimas notícias de tecnologia e IA da Perplexity
 * @returns {Promise<Object>} Dados de notícias estruturados
 */
export async function fetchNewsFromPerplexity() {
  try {
    const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY;
    
    // Fazer a chamada para a API da Perplexity
    const response = await axios.post('https://api.perplexity.ai/chat/completions', {
      model: "sonar-pro", // Usando o modelo recomendado na documentação
      messages: [
        {
          role: 'system',
          content: 'You are a specialized AI/tech that finds and summarizes the latest technology and AI news from around the world. Source from international English-language publications. Your responses should be informative, accurate, and focused on the most impactful recent developments in AI and technology.'
        },
        {
          role: 'user',
          content: `
            Create a daily newsletter based on "What are the latest news about artificial intelligence and technology for developers from TODAY and YESTERDAY ONLY";

            1. TITLE: Create an engaging, tweet-style title (maximum 280 characters) that summarizes the main themes of this Daily newsletter. This should work both as a title and as a shareable summary of the content.

            2. INTRODUCTION: Write a paragraph with acid humor that summarizes the main trends from today's included news. This introduction should capture the essence of the most recent developments while maintaining an irreverent tone that appeals to developers.

            3. MAIN NEWS: Select ONLY the 5 most relevant news stories published TODAY or YESTERDAY about AI and technology for developers. DO NOT include older news. For each story:
              - Headline (tweet-style, maximum 60 characters)
              - Introductory paragraph explaining the news relevance for developers (100-150 words) with a witty, slightly cynical tone similar to newsletters like The Hustle or Morning Brew. Be conversational but informed, use occasional pop culture references or metaphors, and include at least one clever observation that pokes fun at the tech industry's tendencies (like overhyping, buzzword addiction, or corporate behavior). For example, you might say something like "Another tech giant promising to 'revolutionize' an industry that was doing just fine without their help" or "Developers are now expected to learn yet another framework that will definitely still be relevant six months from now (wink, wink)."
              - 4-5 detailed bullet points that provide specific facts about the news, each bullet point should be a complete sentence with precise information (similar to the example provided)
              - Include source links after each news item with the publication date clearly visible
              - A brief opinionated comment on the potential impact of this news

            IMPORTANT: Only include news published within the last 24-48 hours. Do not use older stories even if they seem relevant. Verify the publication dates before including any story.

            Use the following news example as reference for the bullet point format:

            OpenAI Secures Record $40 Billion Funding Round, Valued at $300 Billion
            Well, look at that... OpenAI just secured a "small" cash injection of $40 billion, because apparently creating chatbots that confuse historical facts with fanfiction requires more money than the GDP of several countries. With a valuation of $300 billion, the company is now worth more than Disney, Netflix, and probably every developer's dream of earning a decent salary without having to learn a new framework every three months. The irony? All of this hinges on dropping the "Open" from OpenAI to officially become a for-profit company by 2025. Who would have thought that an organization created to democratize AI would end up as one of the most exclusive and expensive on the planet? Sam Altman must be laughing while swimming in his new Scrooge McDuck-style money vault, while Elon Musk continues to throw a tantrum in the corner.

            OpenAI has finalized the largest private tech funding round in history, raising $40 billion and reaching a valuation of $300 billion.
            SoftBank led the round with a $30 billion investment, joined by Microsoft and other backers contributing $10 billion collectively.
            The full funding amount is contingent on OpenAI restructuring into a for-profit entity by December 31, 2025, a move requiring regulatory approval and facing legal challenges, including opposition from Elon Musk.
            OpenAI plans to allocate $18 billion of the funds to the Stargate project, a joint venture with SoftBank and Oracle aimed at advancing AI infrastructure in the U.S.
            CEO Sam Altman is shifting focus to research and product development, with COO Brad Lightcap taking over day-to-day operations, as the company projects its revenue to triple to $12.7 billion by the end of 2025.
          `
        }
      ],
      max_tokens: 4000,
      temperature: 0.1,
      top_p: 0.9,
    //   search_domain_filter: [
    //     "techcrunch.com", 
    //     "wired.com", 
    //     "technologyreview.com", 
    //     "theverge.com",
    //     "venturebeat.com",
    //     "anthropic.com",
    //     "openai.com",
    //     "github.blog",
    //     "ai.meta.com",
    //     "deepmind.google"
    //   ],
    //   search_recency_filter: "week", // Limitar a notícias da última semana
    //   return_images: true, // Habilitar o retorno de imagens
      frequency_penalty: 1,
      presence_penalty: 0,
      response_format: { 
        type: "json_schema", 
        json_schema: { schema: newsDataSchema }
      },
      web_search_options: {
        search_context_size: "high" // Obter mais contexto de pesquisa
      }
    }, {
      headers: {
        'Authorization': `Bearer ${PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    // A resposta já deve estar no formato JSON esperado graças ao schema
    let newsData = JSON.parse(response.data.choices[0].message.content);
    console.log(JSON.stringify(newsData))
    let searchResults = [];
    // Extrair resultados de pesquisa (incluindo imagens) se disponíveis
    if (response.data.choices[0].message.search_results) {
      searchResults = response.data.choices[0].message.search_results;
    }
    
    // Adicionar timestamp
    newsData.timestamp = new Date().toISOString();
    const portugueseNewsData = await translateNewsToPortuguese(newsData)
    return portugueseNewsData;
  } catch (error) {
    console.error('Erro ao consultar Perplexity API:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * Traduz o objeto de notícias para o português brasileiro, adaptando o tom para o público brasileiro
 * @param {Object} newsData Objeto de notícias a ser traduzido
 * @returns {Object} Objeto de notícias traduzido
*/

export async function translateNewsToPortuguese(newsData) {
  
  const translateText = async (text) => {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `Você é um tradutor especializado em adaptar conteúdo de tecnologia do inglês para o português brasileiro.`
        },
        {
          role: "user",
          content: `Traduza o seguinte texto para o português brasileiro adaptando o conteudo para o BRASIL:\n\n ${text} IMPORTANTE: Não inclua aspas no texto traduzido!`
        }
      ],
      max_tokens: 4000,
      temperature: 0.7,
    });
    return response.choices[0].message.content.trim();
  };

  // Processando título e introdução principal
  const [translatedTitle, translatedIntro] = await Promise.all([
    translateText(newsData.title),
    translateText(newsData.introduction)
  ]);

  // Processando as notícias em paralelo para maior eficiência
  const translatedNewsItems = await Promise.all(
    newsData.news.map(async (item) => {
      // Traduzindo headline, introduction e comment em paralelo
      const [headline, introduction, comment] = await Promise.all([
        translateText(item.headline),
        translateText(item.introduction),
        translateText(item.comment)
      ]);

      // Traduzindo bullet points em paralelo
      const bulletPoints = await Promise.all(item.bulletPoints.map(translateText));

      return {
        headline,
        introduction,
        bulletPoints,
        sources: item.sources, // Mantendo as fontes originais
        comment
      };
    })
  );

  return {
    title: translatedTitle,
    introduction: translatedIntro,
    news: translatedNewsItems,
    timestamp: newsData.timestamp
  };
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