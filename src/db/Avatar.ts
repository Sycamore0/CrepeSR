import { Avatar as AvatarI } from '../data/proto/StarRail';
import Database from './Database';

type UID = number | string;

export default class Avatar {
    private constructor(public ownerUid: UID, public data: AvatarI) {

    }

    public static async create(uid: UID, baseAvatarId: number = 1001) {
        const db = Database.getInstance();
        const avatar = new Avatar(uid, {
            baseAvatarId,
            equipmentUniqueId: 20003,
            equipRelicList: [],
            exp: 0,
            level: 1,
            promotion: 1,
            rank: 1,
            skilltreeList: [],
        });
        db.set("avatars", avatar);
        return avatar;
    }

    public static async fromUID(ownerUid: UID, baseAvatarId?: number) {
        const query = { ownerUid } as { ownerUid: UID, baseAvatarId?: number };
        if (baseAvatarId) query.baseAvatarId = baseAvatarId;
        const db = Database.getInstance();
        return await db.getAll("avatars", query) as unknown as Avatar[];
    }

    public static async remove(ownerUid: UID, baseAvatarId: number) {
        const db = Database.getInstance();
        await db.delete("avatars", { ownerUid, baseAvatarId });
    }

}