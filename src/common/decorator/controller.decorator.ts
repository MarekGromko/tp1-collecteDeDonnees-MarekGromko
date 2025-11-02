import { Annotation } from "@common/Annotation";
import { Request, Response, RequestHandler, ErrorRequestHandler, Router} from "express"
import { NextFunction } from "express-serve-static-core";

type PropOrMethodDescriptor = {
    <T>(target: Object, propKey: string | symbol, descriptor?: TypedPropertyDescriptor<T>):any;
}
type MethodKeys<T> = {
    [K in keyof T]: T[K] extends Function ? K : never
}[keyof T];

type RouteMethods = 'GET' | 'POST' | 'PATCH' | 'DELETE' | 'PUT';
type RouteHandler = {
    method: RouteMethods,
    path:   string,
};
type MiddlewareBuilder = {
    (controller: any): RequestHandler;
}


export const ErrorHandler = <T extends Error>(errorClazzs: {new (...args: any[]): T} | string): PropOrMethodDescriptor => {
    return (target, propKey, descriptor)=>{
        if(descriptor && typeof descriptor.value !== 'function')
            return descriptor;
        const pwrap = Annotation.wrapProp<any>(target, propKey);
        pwrap.annotate('controller.prop.error', errorClazzs);
        return descriptor;
    }
}
export const Middleware = <T>(handler: RequestHandler |  MiddlewareBuilder | MethodKeys<T>): PropOrMethodDescriptor => {
    return (target, propKey, descriptor)=>{
        if(descriptor && typeof descriptor.value !== 'function')
            return descriptor;
        const pwrap = Annotation.wrapProp<any>(target, propKey);
        let builder: MiddlewareBuilder | undefined;
        if(typeof handler === 'function') {
            builder = (handler.length === 1 ?  handler : ()=>handler) as MiddlewareBuilder
        }
        if(typeof handler === 'string') {
            builder = (controler: any) => controler[handler] as MiddlewareBuilder
        };
        if(builder !== undefined)
            pwrap.annotate('controller.prop.middleware', builder);
        return descriptor;
    };
}
export const Route = (method: RouteMethods, path: string): PropOrMethodDescriptor =>{
    return (target, propKey, descriptor)=>{
        if(descriptor && typeof descriptor.value !== 'function')
            return;
        const pwrap = Annotation.wrapProp<any>(target, propKey);
        pwrap.annotate<RouteHandler>('controller.prop.route', {
            method,
            path
        })
        return;
    }
}

export namespace ControllerFacade {
    export const wireErrorEndpoint = <T extends Object>(router: Router, controller: T) => {
        const pwraps  = Annotation
            .wrapInstance(controller)
            .getAnnotatedProps('controller.prop.error');
        const errHandlers = pwraps
            .map(pwrap=>({
                errorClazzs:    pwrap.getMetadata<ErrorConstructor | string>('controller.prop.error').reverse(),
                handler:        pwrap.instanceValue(controller) as ErrorRequestHandler
            }));
        router.use((capturedError: Error, req: Request, res: Response, next: NextFunction)=>{
            for(var i = 0; i<errHandlers.length; i++) {
                var { errorClazzs, handler } = errHandlers[i];
                for(let j = 0; j<errorClazzs.length; j++) {
                    let errClazz = errorClazzs[j]
                    if(typeof errClazz === 'string' ?
                        capturedError.name === errClazz :
                        capturedError instanceof errClazz
                    ) {
                        handler(capturedError, req, res, next);
                        return;
                    }
                }
            }
        })
    }
    export const wireRouteEndpoint = <T extends Object>(router: Router, controller: T) => {
        const pwraps = Annotation
            .wrapInstance(controller)
            .getAnnotatedProps('controller.prop.route');
        const routeHandlers = pwraps
            .map(pwrap=>({
                ...pwrap.getMetadata<RouteHandler>('controller.prop.route').at(-1)!,
                handler:    pwrap.instanceValue(controller) as RequestHandler,
                middleware: pwrap.getMetadata<MiddlewareBuilder>('controller.prop.middleware')
                    .map(mwb=>mwb(controller))
                    .reverse()
            }));
        routeHandlers.forEach(route=>{
            router[route.method.toLowerCase() as Lowercase<RouteMethods>](
                route.path,
                route.middleware,
                route.handler
            );
        })
    }
}