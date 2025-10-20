import { Request, Response } from "express";
import { AuthService } from "../service/AuthService";
import { LoggerFactory, Logger } from "../utility/LoggerFactory";
import { wrapErr, wrapOk } from "../utility/ResponseWrapper";

/**
 * Controller for all authentification related endpoint
 * @requires AuthService
 * @requires LoggerFactory
 */
class AuthController {
    static readonly inject = ['AuthService', 'LoggerFactory'] as const;
    private logger: Logger;
    constructor(
        private service: AuthService,
        loggerFactory: LoggerFactory
    ){
        this.logger = loggerFactory.service('AuthController');
        this.postLogin = this.postLogin.bind(this);
        this.postRegister = this.postRegister.bind(this);
    }
    /**
     * Endpoint to login. Create a session cookie on the key 'skey'
     */
    postLogin(req: Request, res: Response) {
        const {logger} = this;
        const body = req.body;
        if(
            typeof body !== 'object' ||
            !body.email ||
            !body.password
        ){
            logger.error('Login attempt: ill-formed body') 
            res.status(400).end();
            return;
        }

        const result = this.service.login(body.email, body.password);
        switch(result) {
            case 'BadPassword':
                logger.error('Login attempt: Password mismatch');
                return void wrapErr(res).BadRequest().end('wrong password');
            case 'UserNonexistent':
                logger.error('Login attempt: User does not exist');
                return void wrapErr(res).NotFound().end('user not found');
            case 'UserTimeout':
                logger.error('Login attempt: User is in timeout');
                return void wrapErr(res).Unauthorized().end('user in timeout');
        }
        wrapOk(res.cookie('skey', result)).NoContent()
    }
    /**
     * Endpoint to register a new user
     */
    postRegister(req: Request, res: Response) {
        const {logger} = this;
        const body = req.body;
        if(
            typeof body !== 'object' ||
            !body.email ||
            !body.password
        ) {
            logger.error('Register attempt: ill-formed body');
            res.status(400).end();
        }
        const result = this.service.register(body.email, body.password, );
        switch(result) {
            case 'UserAlreadyExists':
                logger.error('Register attempt: User already exists');
                return wrapErr(res).Conflict().end('email already in use');
        }
        wrapOk(res).NoContent();
    }
}

export {
    AuthController
}