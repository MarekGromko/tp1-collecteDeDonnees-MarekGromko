import { containerBase }  from "./container.base";
import { AuthService }    from "./service/auth.service";
import { AuthController } from "./controller/auth.controller";
import { UserController } from "./controller/user.controller";
import { MovieService } from "./service/movie.service";
import { MovieController } from "./controller/movie.controller";

export const containerFinal = containerBase
    .provideClass('AuthService', AuthService)
    .provideClass('AuthController', AuthController)
    .provideClass('UserController', UserController)
    .provideClass('MovieService', MovieService)
    .provideClass('MovieController', MovieController)