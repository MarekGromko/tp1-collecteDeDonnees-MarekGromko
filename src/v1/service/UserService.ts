import type { ServiceResult } from "../core/common";
import type { IUser } from "../core/IUser";
import type { UnknownMedia } from "../core/IMedia";
import type { IDataLayer } from "../core/IDataLayer";
import { mediaMapper } from "./MediaService";

/**
 * Service for everything user related
 * 
 * @requires IDataLayer
 */
class UserService {
    static readonly inject = ['IDataLayer'] as const;
    constructor(
        private db: IDataLayer
    ){};
    /**
     * Get all the user' favorite medias
     * 
     * @param userId 
     * @returns 
     */
    getAllUserMedias(userId: string): ServiceResult<"UserNonexistent", UnknownMedia[]> {
        this.db.pullDb();
        const user = this.db.read<IUser>('user', {
            map:    (row: any)=>row,
            where:  (row: any)=>row.id === userId,
            limit: 1,
        })[0];
        if(!user) return 'UserNonexistent';
        return user.favorites.map(mediaMapper);
    }
}

export { 
    UserService,
};