import { LineupAvatar, LineupInfo } from "../data/proto/StarRail";
import Logger from "../util/Logger";
import Account from "./Account";
import Avatar from "./Avatar";
import Database from "./Database";
const c = new Logger("Player");

interface PlayerI {
    _id: number;
    name: string;
    token: string;
    banned: boolean;
    basicInfo: {
        nickname: string;
        level: number;
        exp: number;
        stamina: number;
        mcoin: number;
        hcoin: number;
        scoin: number;
        worldLevel: number;
    };
    floorId: number;
    planeId: number;
    lineups: LineupI[];
    curLineupIndex: number;
}

interface LineupI{
    isVirtual: boolean;
    leaderSlot: number;
    index: number;
    name: string;
}

export default class Player implements Player {
    private constructor(public db: PlayerI, public avatars: Avatar[]) {}

    public static async fromUID(uid: number | string): Promise<Player | undefined> {
        if (typeof uid == "string") uid = Number(uid);
        const db = Database.getInstance();
        const player = await db.get("players", { _id: uid }) as unknown as PlayerI;
        if (!player) return Player.create(uid);
        const avatars = await Avatar.fromUID(uid);
        return new Player(player, avatars);
    }

    public static async fromToken(token: string): Promise<Player | undefined> {
        const db = Database.getInstance();
        const plr = await db.get("players", { token }) as unknown as PlayerI;
        if (!plr) return Player.fromUID((await Account.fromToken(token))?.uid || Math.round(Math.random() * 50000));
        const avatars = await Avatar.fromUID(plr._id);
        return new Player(plr, avatars);
    }

    public static async create(uid: number | string): Promise<Player | undefined> {
        if (typeof uid == "string") uid = Number(uid);
        const acc = await Account.fromUID(uid);
        if (!acc) {
            c.warn(`Account ${uid} not found`);
            return;
        }

        const db = Database.getInstance();
        const avatars = await Avatar.create(acc.uid);

        const dataObj = {
            _id: acc.uid,
            name: acc.name,
            token: acc.token,
            banned: false,
            lineups: [],
            floorId: 10000000,
            planeId: 10000,
            curLineupIndex: 0,
            basicInfo: {
                exp: 0,
                level: 1,
                hcoin: 0,
                mcoin: 0,
                nickname: acc.name,
                scoin: 0,
                stamina: 100,
                worldLevel: 1,
            }
        } as unknown as PlayerI;

        for(let i = 0; i < 8; i++){
            dataObj.lineups.push({
                isVirtual: false,
                leaderSlot: 0,
                index: i,
                name: `Default ${i}`,
            });
        }

        await db.set("players", dataObj);
        return new Player(dataObj, avatars);
    }

    public getLineup(curIndex: number): LineupAvatar[] {
        const lineupAvatars: LineupAvatar[] = [];
        for(const avatar of this.avatars){
            if(avatar.lineupIndex !== curIndex){
                continue;
            }
            const lineupAvatar = avatar as unknown as LineupAvatar;
            lineupAvatar.slot = avatar.lineupSlot;
            lineupAvatar.id = avatar.baseAvatarId;
            lineupAvatars.push(lineupAvatar);
        }
        return lineupAvatars;
    }

    public async save() {
        const cloned = Object.assign({}, this) as any;
        for(const lineup of cloned.db.lineups)
        {
            delete lineup.avatarList;
        }
        delete cloned.db;
        delete cloned.avatars;
        const db = Database.getInstance();
        await db.update("players", { _id: this.db._id }, cloned);
        this.avatars.forEach(async avatar => {
            await avatar.save();
        });
    }
}