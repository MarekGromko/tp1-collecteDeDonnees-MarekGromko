
export namespace Annotation {
    export const wrapProp = <T extends {}, K extends keyof T = keyof T>(proto: T, propKey: K)=>{
        let sanPropKey = typeof propKey === 'number' ? propKey.toString() : propKey as string | symbol;
        return {
            annotate<T = unknown>(annotation: string, ...metadata: T[]) {
                const ap = (Reflect.getMetadata('props.annotated', proto) || []) as any[];
                if(!ap.includes(propKey))
                    Reflect.defineMetadata('props.annotated', [...ap, propKey], proto);
                
                const old = Reflect.getMetadata(annotation, proto, sanPropKey) || [];
                Reflect.defineMetadata(annotation, [...old, ...metadata], proto, sanPropKey);
            },
            getMetadata<T = unknown>(annotation: string): T[] {
                let x = Reflect.getMetadata(annotation, proto, sanPropKey) || [];
                return x;
            },
            getAnnotations(): string[]{
                return Reflect.getMetadataKeys(proto, sanPropKey)
            },
            key() { 
                return propKey; 
            },
            value() { 
                return Object.getOwnPropertyDescriptor(proto, propKey)!.value as T[K]
            },
            instanceValue(instance: T){
                if(Object.hasOwn(instance, propKey)) {
                    return instance[propKey];
                } else {
                    return (this.value() as Function).bind(this) as T[K];
                }
                
            }
        }
    }

    export const wrapClass = <T extends {}>(clazz: Function | {new (...args: any[]):T})=>{
        const proto     = clazz.prototype as {[K in keyof T]: T[K]};
        const propKeys  = (Reflect.getMetadata('props.annotated', proto) || []) as (keyof T)[];
        return {
            annotate<T = unknown>(annotation: string, ...metadata: T[]) {
                const old = Reflect.getMetadata(annotation, clazz) || [];
                Reflect.defineMetadata(annotation, [...old, metadata], clazz);
            },
            getMetadata<T = unknown>(annotation: string): T[] {
                return Reflect.getMetadata(annotation, clazz) || [];
            },
            getAnnotations(): string[]{
                return Reflect.getMetadataKeys(clazz)
            },
            getAnnotatedProps(...annotations: string[]) {
                return propKeys
                    .map(key=>wrapProp<T>(proto, key))
                    .filter(prop=>annotations.findIndex(a=>prop.getAnnotations().includes(a)) >= 0)
            },
            clazz(){ return clazz; }
        }
    }

    export const wrapInstance = <T extends Object>(instance: T)=>wrapClass<T>(instance.constructor);
}