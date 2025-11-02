export interface SerieDetailResponse {
    id: string,
    title: string,
    genres: string[],
    status: 'ongoing'|'ended'
}
export interface MovieDetailResponse {
    id: string,
    title: string,
    genres: string[],
    durationMin: number,
    synopsis: string | null,
    relasedAt: string | null
}
export interface MovieSearchReponse {
    results: MovieDetailResponse[],
    total:      number 
    page:       number,
    pageSize:   number
}