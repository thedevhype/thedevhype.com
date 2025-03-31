// /lib/perplexity-schema.js

/**
 * Define o esquema JSON para a resposta da Perplexity
 * Isso garante que a resposta esteja no formato exato que precisamos
 */
export const newsDataSchema = {
    "type": "object",
    "required": ["title", "categories"],
    "properties": {
      "title": {
        "type": "string",
        "description": "Um título específico e cativante em português que capture o tema mais significativo entre todas as notícias"
      },
      "categories": {
        "type": "array",
        "items": {
          "type": "object",
          "required": ["name", "news"],
          "properties": {
            "name": {
              "type": "string",
              "description": "Nome da categoria de notícias (ex: 'Inteligência Artificial', 'Desenvolvimento de Tecnologia')"
            },
            "news": {
              "type": "array",
              "items": {
                "type": "object",
                "required": ["title", "subtitle", "imageAlt", "points", "sources"],
                "properties": {
                  "title": {
                    "type": "string",
                    "description": "Título da notícia em português"
                  },
                  "subtitle": {
                    "type": "string",
                    "description": "Subtítulo explicando o contexto e importância da notícia em português"
                  },
                  "imageAlt": {
                    "type": "string",
                    "description": "Descrição de texto alternativo para a imagem que ilustra esta notícia"
                  },
                  "points": {
                    "type": "array",
                    "items": {
                      "type": "object",
                      "required": ["text", "sourceIndex"],
                      "properties": {
                        "text": {
                          "type": "string",
                          "description": "Um ponto específico com fato relevante sobre a notícia em português"
                        },
                        "sourceIndex": {
                          "type": "integer",
                          "description": "Índice da fonte no array 'sources' de onde esta informação foi obtida"
                        }
                      }
                    }
                  },
                  "sources": {
                    "type": "array",
                    "items": {
                      "type": "object",
                      "required": ["title", "url"],
                      "properties": {
                        "title": {
                          "type": "string",
                          "description": "Nome da fonte internacional"
                        },
                        "url": {
                          "type": "string",
                          "description": "URL completa da fonte original em inglês"
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  };