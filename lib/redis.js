// /lib/redis-service.js
import { createClient } from 'redis';

// Configuração única do cliente Redis
let redisClient;

// Função para obter conexão com Redis
export async function getRedisClient() {
  if (redisClient && redisClient.isOpen) {
    return redisClient;
  }

  // Criar um novo cliente
  redisClient = createClient({
    url: process.env.REDIS_URL,
    socket: {
      reconnectStrategy: (retries) => {
        // Backoff exponencial com limite
        const delay = Math.min(Math.pow(2, retries) * 100, 3000);
        return delay;
      }
    }
  });

  // Registrar eventos para depuração
  redisClient.on('error', (err) => console.error('Redis Client Error', err));
  redisClient.on('reconnecting', () => console.log('Redis reconnecting'));
  redisClient.on('connect', () => console.log('Redis connected'));

  // Conectar ao Redis
  await redisClient.connect();
  
  return redisClient;
}

// Chave para o cache de notícias
const NEWS_CACHE_KEY = 'tech_ai_news_cache';

// Tempo de expiração do cache (3 horas em segundos)
const CACHE_TTL = 60 * 60 * 3;

/**
 * Obtém os dados de notícias do cache ou executa a função para buscar os dados
 * @param {Function} fetchFunction - Função para buscar os dados caso não estejam em cache
 * @returns {Promise<Object>} - Dados de notícias
 */
export async function getNewsWithCache(fetchFunction) {
  try {
    const redis = await getRedisClient();
    
    // Tentar obter do cache
    const cachedData = await redis.get(NEWS_CACHE_KEY);
    
    // Se existir no cache e não estiver expirado, retornar
    if (cachedData) {
      console.log('Dados obtidos do cache');
      return JSON.parse(cachedData);
    }
    
    // Se não existir no cache, buscar os dados
    console.log('Cache expirado ou não encontrado, buscando dados novos');
    const freshData = await fetchFunction();
    
    // Armazenar no cache com tempo de expiração
    await redis.set(NEWS_CACHE_KEY, JSON.stringify(freshData), {
      EX: CACHE_TTL
    });
    
    return freshData;
  } catch (error) {
    console.error('Erro ao acessar o cache:', error);
    
    // Em caso de erro no cache, executar a função diretamente
    return fetchFunction();
  }
}

/**
 * Força a atualização do cache
 * @param {Function} fetchFunction - Função para buscar os dados atualizados
 * @returns {Promise<Object>} - Dados de notícias atualizados
 */
export async function forceRefreshCache(fetchFunction) {
  try {
    const redis = await getRedisClient();
    
    // Buscar dados atualizados
    const freshData = await fetchFunction();
    
    // Atualizar o cache
    await redis.set(NEWS_CACHE_KEY, JSON.stringify(freshData), {
      EX: CACHE_TTL
    });
    
    return freshData;
  } catch (error) {
    console.error('Erro ao atualizar o cache:', error);
    throw error;
  }
}

/**
 * Limpa o cache de notícias
 * @returns {Promise<boolean>} - True se o cache foi limpo com sucesso
 */
export async function clearNewsCache() {
  try {
    const redis = await getRedisClient();
    await redis.del(NEWS_CACHE_KEY);
    return true;
  } catch (error) {
    console.error('Erro ao limpar o cache:', error);
    return false;
  }
}

/**
 * Obtém o tempo restante de vida do cache em segundos
 * @returns {Promise<number>} - Tempo restante em segundos ou 0 se expirado/não existir
 */
export async function getCacheTTL() {
  try {
    const redis = await getRedisClient();
    const ttl = await redis.ttl(NEWS_CACHE_KEY);
    return ttl > 0 ? ttl : 0;
  } catch (error) {
    console.error('Erro ao verificar TTL do cache:', error);
    return 0;
  }
}

/**
 * Fecha a conexão com o Redis
 * @returns {Promise<void>}
 */
export async function closeRedisConnection() {
  if (redisClient && redisClient.isOpen) {
    await redisClient.quit();
  }
}