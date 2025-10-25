const EMAIL_REGEX       = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USERNAME_REGEX    = /^[a-zA-Z0-9._-]{3,30}$/;

export namespace CommonValidaton{
    export const validateEmail = (src: string)=>EMAIL_REGEX.test(src);
    export const validateUsername = (src: string)=>USERNAME_REGEX.test(src);
    export const validatePassword = (src: string)=>(
        src.length >= 8 &&
        /[A-Z]/.test(src) &&
        /[a-z]/.test(src) &&
        /[0-9]/.test(src) &&
        /[!@#$%^&*()\-_=+\\|[\]{};:'",.]/.test(src)
    );
}