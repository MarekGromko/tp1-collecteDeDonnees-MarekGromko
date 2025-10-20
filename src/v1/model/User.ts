import { UnknownMedia } from "../core/IMedia.ts";
import { IUser, UserRole } from "../core/IUser.ts";

/**
 * Model User
 * 
 * implements `IUser`
 */
export default class User implements IUser{
    public static from(data: any) {
        return new User(
            data.id,
            data.email,
            data.password,
            data.role,
            data.favorites
        );
    }
    constructor(
        public id: string = '', 
        public email: string = '', 
        public password: string = '', 
        public role: UserRole = 'user', 
        public favorites: UnknownMedia[] = []) 
    {}
    /**
     * Add a media to favorites
     * @param media - UnknownMedia to add to favorites
     */
    addFavorite(media: UnknownMedia): void {
        if(!this.favorites.some(fav=>fav.id == media.id)) {
            this.favorites.push(media);
        }
    }
    /**
     * Remove media from favorite
     * @param media - UnknownMedia to remove from favorites
     */
    removeFavorite(media: UnknownMedia): void {
        const index = this.favorites.findIndex(fav=>fav.id === media.id);
        if(index>0) this.favorites.splice(index,1);
    }
}