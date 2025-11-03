import { ErrorHandler, Middleware, Route } from "@common/decorator/controller.decorator";
import { ErrorRequestHandler, RequestHandler } from "express";
import { AuthError, AuthService } from "../service/auth.service";
import { LoginRequest, RegisterRequest } from "../dto/auth.dto";
import { ValidationMw } from "../middleware/validation.middleware";
import { wrapErr, wrapOk } from "@common/ResponseWrapper";
import { JwtUtil } from "../utility/jwt.utility";
import { containerBase } from "../container.base";

const LoggerMw = containerBase
    .resolve('LoggerFactory')
    .middleware('AuthController');

export class AuthController{
    static readonly inject = ['AuthService'] as const;
    constructor(
        private authService: AuthService
    ){}

    @Middleware(LoggerMw)
    @Middleware(ValidationMw(LoginRequest.validate))
    @Route('POST', '/login')
    login: RequestHandler = async (req, res) => {
        const body = req.body as LoginRequest
        const user = await this.authService.login(body.username, body.password);
        const jwt  = JwtUtil.create(user)
        wrapOk(res).Ok().end({jwt});
    }

    @Middleware(LoggerMw)
    @Middleware(ValidationMw(RegisterRequest.validate))
    @Route('POST', '/register')
    register: RequestHandler = async (req , res) => {
        const body = req.body as RegisterRequest;
        await this.authService.register(body.email, body.username, body.password);
        wrapOk(res).Created().end();
    }

    @ErrorHandler(AuthError.UserAlreadyExists)
    errUserAlreadyExists: ErrorRequestHandler = (err: AuthError.UserAlreadyExists, req, res) => {
        wrapErr(res).Conflict().end(err.message, {field: err.field});
    }

    @ErrorHandler(AuthError.PasswordMismatch)
    errBadPassword: ErrorRequestHandler = (err, req, res) => {
        wrapErr(res).Forbidden().end(err.message);
    }

    @ErrorHandler(AuthError.UserLockout)
    errUserLockout: ErrorRequestHandler = (err, req, res) => {
        wrapErr(res).Forbidden().end(err.message);
    }

    @ErrorHandler(AuthError.UserNotFound)
    errUserNotFound: ErrorRequestHandler = (err, req, res) => {
        wrapErr(res).NotFound().end(err.message);
    }
}