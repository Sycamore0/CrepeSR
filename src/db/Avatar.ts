import { AvatarSkillTree, AvatarType, EquipRelic } from "../data/proto/StarRail";
import Logger from "../util/Logger";
import Database from "./Database";

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

    private constructor(_fromdb: object) {
        Object.assign(this, _fromdb);
    }

    public static async fromUID(uid: string | number): Promise<Avatar[]> {
        const db = Database.getInstance();
        const avatars = await db.getAll("avatars", { ownerUid: Number(uid) }) as unknown as Avatar[];
        if (!avatars) {
            return await Avatar.create(uid);
        }
        return avatars;
    }

    public static async create(uid: string | number): Promise<Avatar[]> {
        const db = Database.getInstance();
        const dataObj = {
            ownerUid: Number(uid),
            avatarType: AvatarType.AVATAR_FORMAL_TYPE,
            baseAvatarId: 1001,
            exp: 25,
            level: 1,
            promotion: 1,
            rank: 1,
            skilltreeList: [],
            equipmentUniqueId: 20000, // EquipmentExcelTable
            equipRelicList: [],
            hp: 1000,
            sp: 1000,
            satiety: 100,
        } as unknown as Avatar;

        await db.set("avatars", dataObj);
        return [dataObj];
    }

    public static async get(uid: string | number, baseAvatarId: number): Promise<Avatar> {
        const db = Database.getInstance();
        const avatar = await db.get("avatars", { ownerUid: Number(uid), baseAvatarId }) as unknown as Avatar;
        return avatar;
    }

    public static async getAll(uid: string | number) {
        const db = Database.getInstance();
        const avatars = await db.getAll("avatars", { ownerUid: Number(uid) }) as unknown as Avatar[];
        return avatars;
    }

    public async save() {
        const db = Database.getInstance();
        await db.update("avatars", { ownerUid: Number(this.ownerUid) }, this);
    }
}