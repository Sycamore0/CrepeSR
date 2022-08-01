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
    lineups: LineupInfo[]
}

export default class Player implements Player {
    private constructor(public db: PlayerI, public avatars: Avatar[]) {
        this.avatars = avatars;
    }

    //TODO: prob move this to a seperated class ?
    public getLineup(index: number): LineupInfo | undefined {
        return this.db.lineups.find(lineup => lineup.index == index);
    }

    public static async fromUID(uid: number | string): Promise<Player | undefined> {
        if (typeof uid == "string") uid = Number(uid);
        const db = Database.getInstance();
        const player = await db.get("players", { _id: uid }) as unknown as PlayerI;
        if (!player) return Player.create(uid);
        return new Player(player, await Avatar.fromUID(uid));
    }

    public static async fromToken(token: string): Promise<Player | undefined> {
        const db = Database.getInstance();
        const plr = await db.get("players", { token }) as unknown as PlayerI;
        if (!plr) return Player.fromUID((await Account.fromToken(token))?.uid || Math.round(Math.random() * 50000));
        return new Player(plr, await Avatar.fromUID(plr._id));
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
        const defaultLineupAvatar = avatars[0] as unknown as LineupAvatar;
        defaultLineupAvatar.id = avatars[0].baseAvatarId;
        defaultLineupAvatar.slot = 0; // Default team only have 1 member

        const dataObj = {
            _id: acc.uid,
            name: acc.name,
            token: acc.token,
            banned: false,
            lineups: [
                {
                    avatarList: [defaultLineupAvatar],
                    index: 0,
                    isVirtual: false, //TODO: find out what is this
                    leaderSlot: 0,
                    mp: 0, //TODO: find out what is this
                    name: "Default",
                } as LineupInfo
            ],
            floorId: 10000000,
            planeId: 10000,
        } as PlayerI;

        await db.set("players", dataObj);
        return new Player(dataObj, avatars);
    }

    public async save() {
        const db = Database.getInstance();
        await db.update("players", { _id: this.db._id }, this.db);
        this.avatars.forEach(async avatar => {
            await avatar.save();
        });
    }
}