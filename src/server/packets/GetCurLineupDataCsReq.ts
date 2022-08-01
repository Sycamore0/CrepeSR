import { GetCurLineupDataCsReq, GetCurLineupDataScRsp, } from "../../data/proto/StarRail";
import Packet from "../kcp/Packet";
import Session from "../kcp/Session";

export default async function handle(session: Session, packet: Packet) {
    session.send("GetCurLineupDataScRsp", {
        retcode: 0,
        lineup: session.player.getLineup(0),
    } as GetCurLineupDataScRsp);
}