import { Request, Response, NextFunction } from "express";
import { FieldValidation } from "../utility/FieldValidation";
import { ISerie } from "../core/IMedia";
import { wrapErr } from "../utility/ResponseWrapper";
import { LoggerFactory, Logger } from "../../common/LoggerFactory";

/**
 * Validate the request body
 * 
 * Body assumed to be more or less like "ISerie"
 * 
 * @requires FieldValidation
 * @requires LoggerFactory
 */
class SerieValidationMiddleware {
    static readonly inject = ['FieldValidation', 'LoggerFactory'] as const;
    private logger: Logger;
    constructor(
        private validator: FieldValidation,
        loggerFactory: LoggerFactory
    ) {
        this.logger = loggerFactory.service('SerieValidationMiddleware');
        this.validateBody = this.validateBody.bind(this);
    }
    /**
     * Film request.body validation middleware
     */
    public validateBody(req: Request, res: Response, next: NextFunction) {
        const body = req.body as any;
        const {validator, logger} = this;
        const makeError = (field: string)=>{
            logger.error(`body is ill-formed on field '${field}'`);
            wrapErr(res).BadRequest().end(`body is ill-formed`, {field, value: body[field]});
        }
        if(typeof body !== 'object') 
            return  logger.error('Body is required'), 
                    wrapErr(res).BadRequest().end('body is missing');
        if(!validator.title(body.title))
            return makeError('title');
        if(!validator.genre(body.genre))
            return makeError('genre');
        if(!validator.year(body.year))
            return makeError('year');
        if(!validator.rating(body.rating)) 
            return makeError('rating');
        if(!validator.platform(body.platform))
            return makeError('platform');
        if(!validator.serieStatus(body.status))
            return makeError('status');
        next();
    }
}

export {
    SerieValidationMiddleware
}