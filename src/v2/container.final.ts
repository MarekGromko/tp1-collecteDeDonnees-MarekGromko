import { containerBase }  from "./container.base";
import { AuthService }    from "./service/auth.service";
import { AuthController } from "./controller/auth.controller";
import { UserController } from "./controller/user.controller";
import { MovieService } from "./service/movie.service";
import { MovieController } from "./controller/movie.controller";
import { SerieService } from "./service/serie.service";
import { SerieController } from "./controller/serie.controller";
import { RatingController } from "./controller/rating.controller";

export const containerFinal = containerBase
    .provideClass('AuthService', AuthService)
    .provideClass('AuthController', AuthController)
    .provideClass('UserController', UserController)
    .provideClass('MovieService', MovieService)
    .provideClass('MovieController', MovieController)
    .provideClass('SerieService', SerieService)
    .provideClass('SerieController', SerieController)
    .provideClass('RatingController', RatingController)