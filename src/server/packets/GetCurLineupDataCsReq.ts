import { GetCurLineupDataCsReq, GetCurLineupDataScRsp, LineupInfo, } from "../../data/proto/StarRail";
import Avatar from "../../db/Avatar";
import Packet from "../kcp/Packet";
import Session from "../kcp/Session";

export default async function handle(session: Session, packet: Packet) {
    const curLineup = session.player.db.lineups.find(lineup => lineup.index === session.player.db.curLineupIndex)! as unknown as LineupInfo;
    curLineup.avatarList = session.player.getLineup(curLineup.index);
    session.send("GetCurLineupDataScRsp", {
        retcode: 0,
        lineup: curLineup,
    } as GetCurLineupDataScRsp);
}