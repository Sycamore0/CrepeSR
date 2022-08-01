import { AvatarSkillTree, AvatarType, EquipRelic } from "../data/proto/StarRail";
import Logger from "../util/Logger";
import Database from "./Database";

const c = new Logger("Avatar");

export default class Avatar {
    protected _id!: number;
    public avatarType!: AvatarType;
    public ownerUid!: number;
    public baseAvatarId!: number;
    public exp!: number;
    public level!: number;
    public promotion!: number;
    public rank!: number;
    public skilltreeList!: AvatarSkillTree[];
    public equipmentUniqueId!: number;
    public equipRelicList!: EquipRelic[];
    public hp!: number;
    public sp!: number;
    public satiety!: number;

    public static async fromUID(uid: string | number): Promise<Avatar[]> {
        const db = Database.getInstance();
        const avatars = await db.getAll("avatars", { ownerUid: Number(uid) }) as unknown as Avatar[];
        if(!avatars){
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
            exp: 0,
            level: 1,
            promotion: 1,
            rank: 1,
            skilltreeList: [],
            equipmentUniqueId: 13501, //todo: find default weapon(?)
            equipRelicList: [],
            hp: 1000,
            sp: 1000,
            satiety: 100,
        } as unknown as Avatar;

        await db.set("avatars", dataObj);
        return [ dataObj ];
    }

    public async save() {
        const db = Database.getInstance();
        await db.update("avatars", { ownerUid: Number(this.ownerUid) }, this);
    }
}