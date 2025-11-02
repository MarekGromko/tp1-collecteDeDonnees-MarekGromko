import { createInjector } from "typed-inject";

import LoggerFactory from "@common/LoggerFactory";
import { JwtUtil } from "./utility/jwt.utility";
import { PasswordEncoder } from "./utility/password.utility";

export const containerBase = createInjector()
    .provideValue("LoggerFactory", new LoggerFactory('2'))
    .provideClass("PasswordEncoder", PasswordEncoder)
    .provideClass("JwtUtil", JwtUtil)
    //.provideClass('AuthService', )