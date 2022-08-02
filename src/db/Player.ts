import { LineupInfo, Vector } from "../data/proto/StarRail";
import { Scene } from "../game/scene";
import Session from "../server/kcp/Session";
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
        pos: Vector;
    }
}

export default class Player {
    readonly scene: Scene;

    private constructor(readonly session: Session, public db: PlayerI) {
        this.scene = new Scene(this);
    }

    public static async fromUID(session: Session, uid: number | string): Promise<Player | undefined> {
        if (typeof uid == "string") uid = Number(uid);
        const db = Database.getInstance();
        const player = await db.get("players", { _id: uid }) as unknown as PlayerI;
        if (!player) return Player.create(session, uid);
        return new Player(session, player);
    }

    public static async fromToken(session: Session, token: string): Promise<Player | undefined> {
        const db = Database.getInstance();
        const plr = await db.get("players", { token }) as unknown as PlayerI;
        if (!plr) return Player.fromUID(session, (await Account.fromToken(token))?.uid || Math.round(Math.random() * 50000));

        return new Player(session, plr);
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
        return new Player(session, dataObj);
    }

    public async save() {
        const db = Database.getInstance();
        await db.update("players", { _id: this.db._id  } , this.db);
    }
}