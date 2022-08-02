import { AvatarType, GetCurLineupDataCsReq, GetCurLineupDataScRsp } from "../../data/proto/StarRail";
import Packet from "../kcp/Packet";
import Session from "../kcp/Session";

export default async function handle(session: Session, packet: Packet) {
    const _lineup = session.player.db.lineup;
    const lineup = _lineup.lineups[_lineup.curIndex];
    session.send("GetCurLineupDataScRsp", {
        retcode: 0,
        lineup
    } as GetCurLineupDataScRsp);
}