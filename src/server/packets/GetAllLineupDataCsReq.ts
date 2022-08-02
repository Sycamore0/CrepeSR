import { GetAllLineupDataScRsp } from "../../data/proto/StarRail";
import Packet from "../kcp/Packet";
import Session from "../kcp/Session";

export default async function handle(session: Session, packet: Packet) {
    const lineup = session.player.db.lineup;
    session.send("GetAllLineupDataScRsp", {
        retcode: 0,
        curIndex: lineup.curIndex,
        lineupList: lineup.lineups,
    } as GetAllLineupDataScRsp);
}