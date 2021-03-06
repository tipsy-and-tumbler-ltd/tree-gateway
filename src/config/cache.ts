'use strict';

import * as Joi from 'joi';
import { StatsConfig, statsConfigValidatorSchema } from './stats';

/**
 * Configure cache for API requests.
 *
 * The Caching system supports two kinds of cache (and both can be used together or alone):
 *  - [Browser cache]((#clientcacheconfig)): The gateway can handle HTTP response headers to
 * make the client browsers keep a cache for configured resources.
 *  - [Memory Cache](#servercacheconfig): The gateway save copies of the proxied API responses
 * into the Redis database.
 */
export interface CacheConfig {
    /**
     * Configuration for a client side cache (in browser).
     */
    client?: ClientCacheConfig;
    /**
     * Configuration for a server side cache (in a Redis store)
     */
    server?: ServerCacheConfig;
    /**
     * A list of groups that should be handled by this configuration. If not provided, everything
     * will be handled.
     * Defaults to *.
     */
    group?: Array<string>;
}

/**
 * Configure HTTP response headers to make the client browsers keep a cache for configured resources.
 */
export interface ClientCacheConfig {
    /**
     * The time to keep the cached resources. You can inform the amount
     * of milisencods, or use a [human-interval](https://www.npmjs.com/package/human-interval) string.
     */
    cacheTime: string | number;
    /**
     * Configure the HTTP ```Cache-Control``` header.
     */
    cacheControl?: string;
    /**
     * Configure the HTTP ```Cache-Control``` header.
     */
    mustRevalidate?: boolean;
    /**
     * Configure the HTTP ```Cache-Control``` header.
     */
    noTransform?: boolean;
    /**
     * Configure the HTTP ```Cache-Control``` header.
     */
    proxyRevalidate?: boolean;
}

/**
 * Configure the caching system to save copies of the proxied API responses into the Redis database.
 */
export interface ServerCacheConfig {
    /**
     * The time to keep the cached resources. You can inform the amount
     * of milisencods, or use a [human-interval](https://www.npmjs.com/package/human-interval) string.
     */
    cacheTime: string | number;
    /**
     * Should be true if the cache content is file or a binary content.
     */
    binary?: boolean;
    /**
     * A list of response received headers that also need to be saved by cache system, to reproduce them
     * to clients.
     */
    preserveHeaders?: Array<string>;
    /**
     * If true, disabled the statistical data recording.
     */
    disableStats?: boolean;
    /**
     * Configurations for cache stats.
     */
    statsConfig?: StatsConfig;
}

const clientCacheValidatorSchema = Joi.object().keys({
    cacheControl: Joi.string().valid('public', 'private', 'no-cache', 'no-store'),
    cacheTime: Joi.alternatives([Joi.string(), Joi.number().positive()]).required(),
    mustRevalidate: Joi.boolean(),
    noTransform: Joi.boolean(),
    proxyRevalidate: Joi.boolean()
});

const serverCacheValidatorSchema = Joi.object().keys({
    binary: Joi.boolean(),
    cacheTime: Joi.alternatives([Joi.string(), Joi.number().positive()]).required(),
    disableStats: Joi.boolean(),
    preserveHeaders: Joi.array().items(Joi.string()),
    statsConfig: statsConfigValidatorSchema
});

export let cacheConfigValidatorSchema = Joi.object().keys({
    client: clientCacheValidatorSchema,
    group: Joi.array().items(Joi.string()),
    server: serverCacheValidatorSchema
});
