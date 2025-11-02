/* istanbul ignore file */
import Ajv, {JSONSchemaType} from "ajv";
import ajvKeywords from "ajv-keywords";
import { CommonValidaton } from "../validation/common.validation";

const ajv = new Ajv({formats: {
    "password": CommonValidaton.validatePassword,
    "email":    CommonValidaton.validateEmail,
    "username": CommonValidaton.validateUsername,
    "date":     (src: string)=>!isNaN(Date.parse(src))
}});
ajvKeywords(ajv, ["transform"]);

export default ajv;
export type {
    JSONSchemaType
}