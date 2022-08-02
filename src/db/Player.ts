import { LineupInfo, Vector } from "../data/proto/StarRail";
import Logger from "../util/Logger";
import Account from "./Account";
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
    }
    lineup: {
        curIndex: number;
        lineups: LineupInfo[];
    }
    posData: {
        floorID: number;
        planeID: number;
        pos?: Vector;
    }
}

export default class Player {
    private constructor(public db: PlayerI) {

    }

    public static async fromUID(uid: number | string): Promise<Player | undefined> {
        if (typeof uid == "string") uid = Number(uid);
        const db = Database.getInstance();
        const player = await db.get("players", { _id: uid }) as unknown as PlayerI;
        if (!player) return Player.create(uid);
        return new Player(player);
    }

    public static async fromToken(token: string): Promise<Player | undefined> {
        const db = Database.getInstance();
        const plr = await db.get("players", { token }) as unknown as PlayerI;
        if (!plr) return Player.fromUID((await Account.fromToken(token))?.uid || Math.round(Math.random() * 50000));

        return new Player(plr);
    }

    public getCurLineup() {
        return this.db.lineup.lineups[this.db.lineup.curIndex];
    }

    public setCurLineup(lineup: LineupInfo, curIndex: number = this.db.lineup.curIndex) {
        this.db.lineup.lineups[curIndex] = lineup;
        this.db.lineup.curIndex = curIndex;
    }

    public static async create(uid: number | string): Promise<Player | undefined> {
        if (typeof uid == "string") uid = Number(uid);
        const acc = await Account.fromUID(uid);
        if (!acc) {
            c.warn(`Account ${uid} not found`);
            return;
        }
        const db = Database.getInstance();

        const dataObj = {
            _id: acc.uid,
            name: acc.name,
            token: acc.token,
            banned: false
        } as PlayerI

        await db.set("players", dataObj);
        return new Player(dataObj);
    }

    public async save() {
        const db = Database.getInstance();
        await db.update("players", { _id: this.db._id  } , this.db);
    }
}