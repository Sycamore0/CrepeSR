import { AvatarSkillTree, AvatarType, EquipRelic, LineupAvatar } from "../data/proto/StarRail";
import AvatarExcel from "../util/excel/AvatarExcel";
import Logger from "../util/Logger";
import Database from "./Database";
type UID = string | number;
const c = new Logger("Avatar");

export default class Avatar {
    public readonly _id!: number;
    public avatarType!: AvatarType;
    public ownerUid!: number;
    public baseAvatarId!: number;
    public exp!: number;
    public level!: number;
    public promotion!: number;
    public rank!: number;
    public skilltreeList?: AvatarSkillTree[];
    public equipmentUniqueId?: number;
    public equipRelicList?: EquipRelic[];
    public hp!: number;
    public sp!: number;
    public satiety!: number;
    public lineupSlot!: number;
    public lineupIndex!: number;

    private constructor(_fromdb: object) {
        Object.assign(this, _fromdb);
    }

    public static async fromUID(uid: UID): Promise<Avatar[]> {
        const db = Database.getInstance();
        const avatarsDb = await db.getAll("avatars", { ownerUid: Number(uid) }) as unknown as Avatar[];
        if (!avatarsDb) {
            return await Avatar.create(uid);
        }
        const avatars: Avatar[] = [];
        avatarsDb.forEach(avatar => avatars.push(new Avatar(avatar)));
        return avatars;
    }

    public static async create(uid: UID): Promise<Avatar[]> {
        const db = Database.getInstance();
        const dataObj = {
            ownerUid: Number(uid),
            avatarType: AvatarType.AVATAR_FORMAL_TYPE,
            baseAvatarId: 1001,
            exp: 25,
            level: 1,
            promotion: 1,
            rank: 1,
            skilltreeList: AvatarExcel.fromId(1001).SkillList,
            equipmentUniqueId: 20000, // EquipmentExcelTable
            equipRelicList: [],
            hp: 1000,
            sp: 1000,
            satiety: 100,
            lineupSlot: 0, 
            lineupIndex: 0
        } as unknown as Avatar;

        await db.set("avatars", dataObj);
        return [new Avatar(dataObj)];
    }

    public static async add(uid: UID, avatarId: number): Promise<Avatar> {
        const db = Database.getInstance();
        const dataObj = {
            ownerUid: Number(uid),
            avatarType: AvatarType.AVATAR_FORMAL_TYPE,
            baseAvatarId: avatarId,
            exp: 25,
            level: 1,
            promotion: 1,
            rank: 1,
            skilltreeList: AvatarExcel.fromId(avatarId).SkillList,
            equipmentUniqueId: 20000, // EquipmentExcelTable
            equipRelicList: [],
            hp: 1000,
            sp: 1000,
            satiety: 100,
            lineupSlot: 0, 
            lineupIndex: 0
        } as unknown as Avatar;

        await db.set("avatars", dataObj);
        return new Avatar(dataObj);
    }

    public static async remove(uid: UID, avatarId: number): Promise<void> {
        const db = Database.getInstance();
        await db.delete("avatars", { ownerUid: Number(uid), baseAvatarId: avatarId });
    }

    public static async get(uid: UID, baseAvatarId: number): Promise<Avatar> {
        const db = Database.getInstance();
        const avatar = await db.get("avatars", { ownerUid: Number(uid), baseAvatarId }) as unknown as Avatar;
        return avatar;
    }

    public static async getAll(uid: UID) {
        const db = Database.getInstance();
        const avatars = await db.getAll("avatars", { ownerUid: Number(uid) }) as unknown as Avatar[];
        return avatars;
    }

    public async save() {
        const cloned = Object.assign({}, this) as any;
        delete cloned.id;
        delete cloned.index;
        const db = Database.getInstance();
        await db.update("avatars", { ownerUid: Number(this.ownerUid) }, cloned);
    }
}