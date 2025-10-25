/**
 * @file Base functional Service container for DI
 */
import { createInjector } from 'typed-inject';
import { FieldValidation } from "./utility/FieldValidation";
import { PasswordUtility } from "./utility/PasswordUtility";
import LoggerFactory from "../common/LoggerFactory";

export const baseContainer = createInjector()
    .provideValue('FieldValidation', new FieldValidation)
    .provideValue('PasswordUtility', new PasswordUtility)
    .provideValue('LoggerFactory', new LoggerFactory("1"))