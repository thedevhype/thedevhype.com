// /lib/mail/json_schema.js
/**
 * Schema para validação e estruturação dos dados de notícias
 * Este schema é usado para garantir que a API Perplexity retorne dados no formato esperado
 */
export const newsDataSchema = {
  type: "object",
  required: ["title", "introduction", "news"],
  properties: {
    title: {
      type: "string",
      description: "Título principal da newsletter, estilo tweet (máximo 280 caracteres)",
      maxLength: 280
    },
    introduction: {
      type: "string",
      description: "Parágrafo introdutório com tom irreverente que resume as principais tendências",
      minLength: 100,
      maxLength: 600
    },
    news: {
      type: "array",
      description: "Lista das 5 notícias mais relevantes para desenvolvedores",
      minItems: 5,
      maxItems: 5,
      items: {
        type: "object",
        required: ["headline", "introduction", "bulletPoints", "sources", "comment"],
        properties: {
          headline: {
            type: "string",
            description: "Título curto e impactante da notícia (máximo 60 caracteres)",
            maxLength: 60
          },
          introduction: {
            type: "string",
            description: "Parágrafo introdutório explicando a relevância da notícia para desenvolvedores (100-150 palavras)",
            minLength: 100,
            maxLength: 800
          },
          bulletPoints: {
            type: "array",
            description: "Lista de 4-5 pontos com informações específicas sobre a notícia",
            minItems: 4,
            maxItems: 5,
            items: {
              type: "string",
              description: "Frase completa com informação precisa e relevante"
            }
          },
          sources: {
            type: "array",
            description: "Fontes da notícia (pelo menos 2 fontes diferentes)",
            minItems: 2,
            items: {
              type: "object",
              required: ["title", "url", "publishDate"],
              properties: {
                title: {
                  type: "string",
                  description: "Título do artigo fonte"
                },
                url: {
                  type: "string",
                  description: "URL completo da fonte",
                  format: "uri"
                },
                publishDate: {
                  type: "string",
                  description: "Data de publicação (formato YYYY-MM-DD)",
                  pattern: "^\\d{4}-\\d{2}-\\d{2}$"
                }
              }
            }
          },
          comment: {
            type: "string",
            description: "Breve comentário opinativo sobre o potencial impacto da notícia (1-3 frases)",
            minLength: 50,
            maxLength: 300
          }
        }
      }
    }
  }
};