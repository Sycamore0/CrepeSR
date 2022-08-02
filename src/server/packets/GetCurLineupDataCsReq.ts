import { AvatarType, GetCurLineupDataCsReq, GetCurLineupDataScRsp } from "../../data/proto/StarRail";
import Packet from "../kcp/Packet";
import Session from "../kcp/Session";

export default async function handle(session: Session, packet: Packet) {
    const lineup = session.player.getCurLineup();
    session.send("GetCurLineupDataScRsp", {
        retcode: 0,
        lineup
    } as GetCurLineupDataScRsp);
}