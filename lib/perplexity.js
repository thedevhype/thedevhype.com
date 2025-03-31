// /lib/perplexity-service.js
import axios from 'axios';
import { newsDataSchema } from './mail/json_schema';

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
          content: 'You are a specialized AI that finds and summarizes the latest technology and AI news from around the world. You translate everything to Portuguese, but source from international English-language publications. Your responses should be informative, accurate, and focused on the most impactful recent developments in AI and technology.'
        },
        {
          role: 'user',
          content: 'What are the latest news about artificial intelligence and technology development in the world today. In Brazlian portuguese with sources links'
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
    let searchResults = [];
    // Extrair resultados de pesquisa (incluindo imagens) se disponíveis
    if (response.data.choices[0].message.search_results) {
      searchResults = response.data.choices[0].message.search_results;
    }
    
    // Adicionar timestamp
    newsData.timestamp = new Date().toISOString();
    
    // Processar resultados de pesquisa para adicionar imagens às notícias
    if (searchResults && searchResults.length > 0) {
      // Adicionar imagens a cada notícia
      newsData.categories.forEach(category => {
        category.news.forEach((newsItem, newsIndex) => {
          // Tentar encontrar uma imagem relevante nos resultados de pesquisa
          const relevantResults = searchResults.filter(result => {
            // Verificar se o título da notícia está relacionado com o resultado da pesquisa
            return result.title && 
                   (result.title.toLowerCase().includes(newsItem.title.toLowerCase().substring(0, 20)) ||
                    newsItem.title.toLowerCase().includes(result.title.toLowerCase().substring(0, 20)));
          });
          
          // Selecionar o primeiro resultado que tenha uma imagem
          const resultWithImage = relevantResults.find(result => result.images && result.images.length > 0);
          
          // Se encontrou uma imagem, adicionar à notícia
          if (resultWithImage && resultWithImage.images && resultWithImage.images.length > 0) {
            newsItem.image = {
              url: resultWithImage.images[0].url,
              alt: newsItem.imageAlt || `Imagem ilustrativa para: ${newsItem.title}`
            };
          } else {
            // Imagem fallback baseada no índice da notícia
            const categoryName = category.name.toLowerCase().replace(/\s+/g, '-');
            const index = newsIndex + 1;
            newsItem.image = {
              url: `https://source.unsplash.com/random/800x450?${categoryName},tech,${index}`,
              alt: newsItem.imageAlt || `Imagem ilustrativa para: ${newsItem.title}`
            };
          }
          
          // Remover o campo imageAlt pois já foi usado
          delete newsItem.imageAlt;
        });
      });
    } else {
      // Se não recebeu resultados de pesquisa, usar imagens genéricas
      newsData.categories.forEach(category => {
        category.news.forEach((newsItem, newsIndex) => {
          const categoryName = category.name.toLowerCase().replace(/\s+/g, '-');
          const index = newsIndex + 1;
          newsItem.image = {
            url: `https://source.unsplash.com/random/800x450?${categoryName},tech,${index}`,
            alt: newsItem.imageAlt || `Imagem ilustrativa para: ${newsItem.title}`
          };
          
          // Remover o campo imageAlt pois já foi usado
          delete newsItem.imageAlt;
        });
      });
    }
    
    return newsData;
  } catch (error) {
    console.error('Erro ao consultar Perplexity API:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * Obtém dados de exemplo para desenvolvimento/testes
 * @returns {Object} Dados de notícias de exemplo
 */
export function getMockNewsData() {
  return {
    "title": "IA Avança na Medicina e Transformação Digital Acelera no Brasil",
    "timestamp": new Date().toISOString(),
    "categories": [
      {
        "name": "Inteligência Artificial",
        "news": [
          {
            "title": "IA Detecta Anomalias Fetais com Maior Velocidade",
            "subtitle": "Um estudo britânico revela que a inteligência artificial pode detectar anomalias fetais quase duas vezes mais rápido do que métodos convencionais.",
            "image": {
              "url": "https://source.unsplash.com/random/800x450?ai,medical,ultrasound",
              "alt": "Técnico de ultrassom utilizando sistema de IA para analisar imagem fetal"
            },
            "points": [
              {
                "text": "A IA aumenta a velocidade de detecção de anomalias fetais em 42% em comparação com métodos tradicionais.",
                "sourceIndex": 0
              },
              {
                "text": "O estudo foi conduzido pelo King's College de Londres e envolveu 78 gestantes e 58 técnicos de ultrassom.",
                "sourceIndex": 0
              },
              {
                "text": "A tecnologia automatiza parte do processo, liberando tempo para os profissionais se concentrarem nos pacientes.",
                "sourceIndex": 0
              },
              {
                "text": "Bill Gates prevê que a IA substituirá muitas funções humanas, mas áreas como biociências de saúde permanecerão relevantes.",
                "sourceIndex": 2
              }
            ],
            "sources": [
              {"title": "G1", "url": "https://g1.globo.com/ciencia/noticia/2025/03/29/inteligencia-artificial-detecta-anomalias-fetais-quase-duas-vezes-mais-rapido-aponta-estudo.ghtml"},
              {"title": "CNN Brasil", "url": "https://www.cnnbrasil.com.br/tudo-sobre/inteligencia-artificial/"},
              {"title": "O Tempo", "url": "https://www.otempo.com.br/economia/2025/3/29/bill-gates-aponta-tres-profissoes-que-vao-sobreviver-inteligencia-artificial"}
            ]
          },
          {
            "title": "Modelos de IA Multimodal Atingem Novo Marco",
            "subtitle": "Novos modelos de IA conseguem processar e entender simultaneamente texto, imagem e áudio com precisão sem precedentes.",
            "image": {
              "url": "https://source.unsplash.com/random/800x450?ai,multimodal,neural",
              "alt": "Representação visual de um modelo multimodal processando diferentes tipos de mídia"
            },
            "points": [
              {
                "text": "A Anthropic lançou o Claude 3.5 com capacidades multimodais avançadas que superam benchmarks anteriores.",
                "sourceIndex": 0
              },
              {
                "text": "O modelo demonstra uma compreensão contextual profunda entre diferentes tipos de mídia.",
                "sourceIndex": 0
              },
              {
                "text": "Aplicações médicas do modelo já estão sendo testadas para diagnóstico com base em imagens e descrições de sintomas.",
                "sourceIndex": 1
              },
              {
                "text": "Pesquisadores preveem que modelos multimodais serão o padrão em assistentes digitais até 2026.",
                "sourceIndex": 2
              }
            ],
            "sources": [
              {"title": "Anthropic Blog", "url": "https://www.anthropic.com/news"},
              {"title": "MIT Technology Review", "url": "https://www.technologyreview.com/"},
              {"title": "TechCrunch", "url": "https://techcrunch.com/"}
            ]
          }
        ]
      },
      {
        "name": "Desenvolvimento de Tecnologia",
        "news": [
          {
            "title": "Ferramentas No-Code Transformam Desenvolvimento de Software",
            "subtitle": "Plataformas de desenvolvimento sem código estão permitindo que não-programadores criem aplicações empresariais complexas.",
            "image": {
              "url": "https://source.unsplash.com/random/800x450?nocode,software,development",
              "alt": "Usuário criando uma aplicação em uma plataforma de desenvolvimento no-code"
            },
            "points": [
              {
                "text": "O mercado de ferramentas no-code deve ultrapassar US$45 bilhões até 2026, segundo relatório da Gartner.",
                "sourceIndex": 0
              },
              {
                "text": "Empresas relatam redução de 65% no tempo de desenvolvimento para aplicações internas.",
                "sourceIndex": 0
              },
              {
                "text": "O GitHub Copilot está desenvolvendo recursos específicos para geração de aplicações completas sem código.",
                "sourceIndex": 1
              },
              {
                "text": "Desenvolvedores tradicionais estão se reposicionando como arquitetos de solução e consultores de IA.",
                "sourceIndex": 2
              }
            ],
            "sources": [
              {"title": "Gartner", "url": "https://www.gartner.com/"},
              {"title": "GitHub Blog", "url": "https://github.blog/"},
              {"title": "Stack Overflow Blog", "url": "https://stackoverflow.blog/"}
            ]
          },
          {
            "title": "Avanços em Computação Quântica Prometem Revolução em Criptografia",
            "subtitle": "Pesquisadores demonstram algoritmo quântico que pode quebrar sistemas de criptografia atuais em questão de horas.",
            "image": {
              "url": "https://source.unsplash.com/random/800x450?quantum,computing,security",
              "alt": "Processador quântico em ambiente de laboratório criogênico"
            },
            "points": [
              {
                "text": "O IBM Quantum alcançou 1.000 qubits funcionais, um marco considerado crítico para aplicações práticas.",
                "sourceIndex": 0
              },
              {
                "text": "Agências governamentais já estão implementando criptografia pós-quântica para proteger dados sensíveis.",
                "sourceIndex": 1
              },
              {
                "text": "Empresas financeiras estão investindo bilhões em novos sistemas de segurança resistentes a computação quântica.",
                "sourceIndex": 1
              },
              {
                "text": "Especialistas recomendam que empresas comecem a transição para criptografia pós-quântica imediatamente.",
                "sourceIndex": 2
              }
            ],
            "sources": [
              {"title": "IBM Research", "url": "https://research.ibm.com/"},
              {"title": "Wired", "url": "https://www.wired.com/"},
              {"title": "NIST", "url": "https://www.nist.gov/"}
            ]
          }
        ]
      }
    ]
  };
}