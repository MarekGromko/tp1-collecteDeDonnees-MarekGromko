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
    releaseDate: string | null
}