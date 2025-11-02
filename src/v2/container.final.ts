import { containerBase }  from "./container.base";
import { AuthService }    from "./service/auth.service";
import { AuthController } from "./controller/auth.controller";
import { UserController } from "./controller/user.controller";

export const containerFinal = containerBase
    .provideClass('AuthService', AuthService)
    .provideClass('AuthController', AuthController)
    .provideClass('UserController', UserController)