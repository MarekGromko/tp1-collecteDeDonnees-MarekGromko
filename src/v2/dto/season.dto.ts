import { Season } from "../model/season.mode";
import ajv, { JSONSchemaType } from "../setup/ajv.setup";

export interface SeasonDetailResponse {
    id: string,
    serieId: string,
    seasonNo: number,
    episodeNb: number,
}
export namespace SeasonDetailResponse {
    export const fromModel = (season: Season.Model): SeasonDetailResponse=>({
        id: season._id.toString('hex'),
        serieId: season.serieRef._id.toString('hex'),
        episodeNb: season.episodeNb,
        seasonNo: season.seasonNo,
    });
}

export interface PostSeasonRequest {
    seasonNo:   number,
    episodeNb?:  number
}
export namespace PostSeasonRequest {
    export const schema: JSONSchemaType<PostSeasonRequest> = {
        type: "object",
        properties: {
            "seasonNo":  { type: "number", minimum: 1 },
            "episodeNb": { nullable: true, type: "number", minimum: 0, default: 0 }
        },
        required: ["seasonNo"]
    }
    export const validation = ajv.compile(schema);
}