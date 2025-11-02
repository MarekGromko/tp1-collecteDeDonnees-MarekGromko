import ajv, { JSONSchemaType } from "../setup/ajv.setup";
import { Episode } from "../model/episode.model";

export interface EpisodeDetailResponse {
    id: string,
    title: string,
    serieId: string,
    seasonId: string,
    epNo: number,
    durationMin: number
}
export namespace EpisodeDetailResponse {
    export const fromModel = (ep: Episode.Model): EpisodeDetailResponse=>({
        id:     ep._id.toHexString(),
        title:  ep.title,
        serieId:  ep.serieRef._id.toHexString(),
        seasonId: ep.seasonRef._id.toHexString(),
        epNo: ep.epNo,
        durationMin: ep.durationMin
    });
}

export interface EpisodeSearchResponse {
    results:    EpisodeDetailResponse[]
    total:      number
    page:       number,
    pageSize:   number
}

export interface PostEpisodeRequest {
    title:          string,
    epNo:           number,
    durationMin:    number
}
export namespace PostEpisodeRequest {
    export const schema: JSONSchemaType<PostEpisodeRequest> = {
        type: "object",
        properties: {
            "title":        { type: "string", minLength: 1, maxLength: 200 },
            "epNo":         { type: "number", minimum: 1 },
            "durationMin":  { type: "number", minimum: 1, maximum: 300}
        },
        required: ["title", "epNo", "durationMin"]
    }
    export const validation = ajv.compile(schema);
}