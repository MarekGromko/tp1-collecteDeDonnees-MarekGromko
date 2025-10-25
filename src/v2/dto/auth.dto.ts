import ajv, { JSONSchemaType } from "../config/ajv.config";

export interface RegisterRequest {
    email: string,
    username: string,
    password: string
}
export namespace RegisterRequest {
    export const schema: JSONSchemaType<RegisterRequest> = {
        type: "object",
        properties: {
            "email":    { type: "string", format: "email", transform: ["trim"] },
            "username": { type: "string", format: "username" },
            "password": { type: "string", format: "password" }
        },
        required: ["email", "username", "password"]
    }
    export const validate = ajv.compile(schema);
}

export interface LoginRequest {
    username: string,
    password: string
}
export namespace LoginRequest {
    export const schema: JSONSchemaType<LoginRequest> =  {
        type: "object",
        properties: {
            username: { type: "string", format: "username" },
            password: { type: "string", format: "password" }
        },
        required: ["username", "password"]
    }
    export const validate = ajv.compile(schema);
}

export interface JwtResponse{
    jwt: string
}