// /lib/perplexity-schema.js

/**
 * Define o esquema JSON para a resposta da Perplexity
 * Isso garante que a resposta esteja no formato exato que precisamos para a newsletter diária
 */
export const newsDataSchema = {
  "type": "object",
  "required": ["title", "introduction", "news"],
  "properties": {
    "title": {
      "type": "string",
      "description": "Um título em estilo tweet (máximo 280 caracteres) que resuma os principais temas da newsletter diária. Deve funcionar tanto como título quanto como resumo compartilhável do conteúdo"
    },
    "introduction": {
      "type": "string",
      "description": "Um parágrafo com humor ácido que resume as principais tendências das notícias incluídas. Esta introdução deve capturar a essência dos desenvolvimentos mais recentes mantendo um tom irreverente que atraia desenvolvedores"
    },
    "news": {
      "type": "array",
      "description": "Uma lista de 3-6 notícias mais relevantes APENAS DE HOJE/ONTEM sobre IA e tecnologia para desenvolvedores",
      "items": {
        "type": "object",
        "required": ["headline", "introduction", "bulletPoints", "sources", "comment"],
        "properties": {
          "headline": {
            "type": "string",
            "description": "Título impactante em estilo tweet (máximo 60 caracteres)"
          },
          "introduction": {
            "type": "string",
            "description": "Parágrafo introdutório explicando a relevância da notícia para desenvolvedores (100-150 palavras)"
          },
          "bulletPoints": {
            "type": "array",
            "items": {
              "type": "string",
              "description": "Um ponto detalhado que fornece um fato específico sobre a notícia. Cada bullet point deve ser uma frase completa com informação precisa"
            },
            "minItems": 4,
            "maxItems": 5
          },
          "sources": {
            "type": "array",
            "items": {
              "type": "object",
              "required": ["title", "url", "publishDate"],
              "properties": {
                "title": {
                  "type": "string",
                  "description": "Nome da fonte"
                },
                "url": {
                  "type": "string",
                  "description": "URL completa da fonte original"
                },
                "publishDate": {
                  "type": "string",
                  "description": "Data de publicação da notícia (deve ser hoje ou ontem)"
                }
              }
            },
            "minItems": 1
          },
          "comment": {
            "type": "string",
            "description": "Um breve comentário opinativo sobre o potencial impacto desta notícia"
          }
        }
      },
      "minItems": 3,
      "maxItems": 6
    }
  }
};