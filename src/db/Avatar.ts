import { Avatar as AvatarI } from '../data/proto/StarRail';
import Database from './Database';

type UID = number | string;

export default class Avatar {
    private constructor(public ownerUid: UID, public data: AvatarI) {

    }

    public static async create(uid: UID, baseAvatarId: number = 1001): Promise<Avatar> {
        const db = Database.getInstance();
        // Check if already exists
        const existing = await Avatar.fromUID(uid, baseAvatarId);
        if (existing.length > 0) return existing[0];
        const avatar = new Avatar(uid, {
            baseAvatarId,
            equipmentUniqueId: 20003, // TODO: Placeholder while we work on inventory system
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

    public static async fromUID(ownerUid: UID, baseAvatarId?: number): Promise<Avatar[]> {
        const query = { ownerUid } as { ownerUid: UID, "data.baseAvatarId"?: number };
        if (baseAvatarId) query['data.baseAvatarId'] = baseAvatarId;
        const db = Database.getInstance();
        return await db.getAll("avatars", query) as unknown as Avatar[];
    }

    public static async remove(ownerUid: UID, baseAvatarId: number): Promise<void> {
        const db = Database.getInstance();
        await db.delete("avatars", { ownerUid, baseAvatarId });
    }

}