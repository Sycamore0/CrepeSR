import { GetAllLineupDataScRsp } from "../../data/proto/StarRail";
import Packet from "../kcp/Packet";
import Session from "../kcp/Session";

export default async function handle(session: Session, packet: Packet) {
    session.send("GetAllLineupDataScRsp", {
        retcode: 0,
        lineupList: session.player.db.lineups
    } as unknown as GetAllLineupDataScRsp);
}