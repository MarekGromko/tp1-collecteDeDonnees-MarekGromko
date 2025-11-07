const Parser = require('config/parser');

const REGEXP_FULL_VALUE_ENV    = /^\$[a-z-A-Z0-9_]+$/
const REGEXP_INTERPO_VALUE_ENV = /(?<!\\)\$\{([a-z-A-Z-0-9_]+)(\:\-[^\}]*)?\}/g
const CONFIG_SKIP_MISSING_ENV  = Boolean(process.env.CONFIG_SKIP_MISSING_ENV);

const injectUnknow = (unknow)=>{
    if(typeof unknow === 'object' && unknow !== null) {
        return injectObject(unknow);
    }
    if(typeof unknow === 'string') {
        return injectString(unknow);
    }
    return unknow;
}

const injectObject = (obj)=>{
    const keys = Object
        .getOwnPropertyNames(obj)
        .filter(key=>!key.startsWith('__'))
    for(let key of keys)
        obj[key] = injectUnknow(obj[key]);
    return obj;
}

const injectString = (source)=>{
    if(REGEXP_FULL_VALUE_ENV.test(source)) {
        return deferEnvValue(source.slice(1));
    }
    return source.replace(REGEXP_INTERPO_VALUE_ENV, (_, ...group)=>{
        const fallback  = group[1] ? group[1].slice(2) : undefined;
        const value     = deferEnvValue(group[0], fallback, false);
        return value === null ? '' : value.toString();
    })
}

const deferEnvValue = (name, fallback = undefined, coerce = true)=>{
    let value = process.env[name];
    if(value === undefined) {
        if(fallback !== undefined) {
            value = fallback;
        } else {
            if(!CONFIG_SKIP_MISSING_ENV)
                console.error(`Required env variable "${name}" is undefined`);
            return null;
        }
    }
    if (coerce) {
        let valueAsNumber = Number(value).valueOf();
        return isNaN(valueAsNumber) ? value : valueAsNumber;
    }
    return value;
}

Parser.setParser('yml',   (...args)=>injectUnknow(Parser.yamlParser(...args)));
Parser.setParser('yaml',  (...args)=>injectUnknow(Parser.yamlParser(...args)));
Parser.setParser('json',  (...args)=>injectUnknow(Parser.jsonParser(...args)));

module.exports = Parser;