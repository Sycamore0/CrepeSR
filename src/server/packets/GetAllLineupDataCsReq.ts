import { GetAllLineupDataScRsp } from "../../data/proto/StarRail";
import Packet from "../kcp/Packet";
import Session from "../kcp/Session";

export default async function handle(session: Session, packet: Packet) {
    let lineup = session.player.db.lineup;
    if (!lineup.curIndex) {
        lineup.curIndex = 0;
        session.player.db.lineup.curIndex = 0;
        session.player.save();
    }
    session.send("GetAllLineupDataScRsp", {
        retcode: 0,
        curIndex: lineup.curIndex,
        lineupList: lineup.lineups,
    } as GetAllLineupDataScRsp);
}