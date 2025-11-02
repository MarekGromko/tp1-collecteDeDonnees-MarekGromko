interface AssertString {
     <E>(src: any, orelse: E): string | E
     (src: any): string | undefined
}

interface AssertInt {
    <E>(src: any, orelse: E): number | E
    (src: any): number | undefined
}

export namespace Assert {
    export const map = <T, R>(src: T, map: (src: Exclude<T, undefined>) => (R)): R | Extract<T, undefined> => (
        src === undefined ? undefined as any : map(src as any)
    );
    export const condition = <T>(src: T, ...checks: ((src: Exclude<T, undefined>) => boolean)[]): T | undefined => {
        if(src === undefined)
            return
        for(let check of checks)
            if(check(src as any))
                return
        return src;
    };
    export const int: AssertInt = (src: any, orelse?: any): number | any=>{
        if(typeof src === 'string') src = parseInt(src);
        if(typeof src !== 'number') return orelse;
        if(isNaN(src)) return orelse
        return src;
    };
    export const string: AssertString = (src: any, orelse?: any | undefined): string | any => (
        typeof src === 'string' ? src : orelse
    );
    export const orelse = <T, E>(src: T, orelse: E): Exclude<T, undefined> | E => (
        src === undefined ? orelse : src as any
    );
}