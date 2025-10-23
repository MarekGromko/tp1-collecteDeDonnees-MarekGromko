/**
 * @file 
 */

import fs from "node:fs";
import loggerFactory from "./LoggerFactory";

const logger = loggerFactory.service('ENV');

/** @inner */
const callFallback = (fallback: any, key: string, ...args: any[])=>{
    let value = fallback;
    if(typeof fallback === 'function') {
        try {
            value = fallback(...args);
        } catch(err) {
            // if fallback fail
            if(err instanceof Error){
                logger.error(err.message);
            } else if(typeof err === 'string'){
                logger.error(err);
            }
            process.exit();
        }
    } else if(fallback === undefined){
        logger.error(`required env variable ${key}`);
        process.exit();
    }
    return value;
}

/**
 * Get an environnement variable
 * 
 * @param key - the env variable name
 * @param parse - to modify the env variable
 * @param fallback - in case the env doesn't exist / the fallback fail
 * @returns 
 */
const required = (key: string, parse?: (value: string)=>any, fallback?: any)=> {
    const value = process.env[key];
    if(value === undefined)
        return callFallback(fallback, key);
    return parse ? parse(value) : value;
}

/**
 * Expect an env variable as an int
 * 
 * @param key 
 * @param fallback 
 * @returns an int
 */
const requiredInt = (key: string, fallback?: any): number =>{
    const value = required(key, Number,undefined);
    if(isNaN(value)) 
        return callFallback(fallback, key);
    return value | 0; // make it integer
}

/**
 * Expect an env variable as a number (float or int)
 * 
 * @param key 
 * @param fallback 
 * @returns a number
 */
const requiredNum = (key: string, fallback?: any): number =>{
    const value = required(key, Number, undefined);
    if(value === undefined)
        return callFallback(fallback, key);
    return value;
}

/**
 * Expect an env variable as a string
 * 
 * @param key 
 * @param fallback 
 * @returns a string
 */
const requiredStr = (key: string, fallback?: any): string =>{
    return required(key, undefined, fallback);
}

/**
 * Expect an env variable to point to an existing file
 * 
 * @param key 
 * @param fallback 
 * @returns a string
 */
const requiredExistingFilename = (key: string, fallback?: any): string => required(
    key,
    value=>{
        if(fs.existsSync(value)) 
            return value;
        logger.error(`required file from env variable ${key} does not exists '${value}'`)
        process.exit();
    },
    fallback
)

const env = {
    required,
    requiredInt,
    requiredNum,
    requiredStr,
    requiredExistingFilename
};

export default env;