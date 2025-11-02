import { JSONSchemaType } from "ajv"
import ajv from "../setup/ajv.setup";

export interface PatchUserRequest{
    email?: string,
    username?: string,
    favoritesToAdd?: (
        { kind: 'Movie' | 'Serie', id: string }
    )[];
    favoritesToRemove?: (
        { kind: 'Movie' | 'Serie', id: string }
    )[];
}

export namespace PatchUserRequest{
    const favoriteItemSchema: JSONSchemaType<{kind: 'Movie' | 'Serie', id: string}> = {
        type: "object",
        properties: {
            "kind": { type: "string", enum: ["Movie", "Serie"] },
            "id":   { type: "string" }
        },
        required: ["kind", "id"] as const,
        additionalProperties: true
    }
    export const schema: JSONSchemaType<PatchUserRequest> = {
        type: "object",
        properties: {
            "email":    { nullable: true, type: "string", format: "email", transform: ["trim"] },
            "username": { nullable: true, type: "string", format: "username" },
            "favoritesToAdd": {
                nullable: true,
                type: "array",
                items: favoriteItemSchema
            },
            "favoritesToRemove": {
                nullable: true,
                type: "array",
                items: favoriteItemSchema
            }
        },
        required: [],
    }
    export const validate = ajv.compile(schema);
}

export interface UserDetailResponse {
    username: string,
    email: string,
    role: 'admin' | 'user'
    favorites: {
        kind: 'Movie' | 'Serie',
        id: string
    }[]
};