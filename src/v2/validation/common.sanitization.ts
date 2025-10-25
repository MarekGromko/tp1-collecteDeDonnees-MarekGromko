import sanitizeHtml from 'sanitize-html';

export namespace CommonSanitization {
    export const sanitizeForHtml = (src: string) => sanitizeHtml(src.trim());
}