import { GetAllLineupDataScRsp, LineupAvatar, LineupInfo } from "../../data/proto/StarRail";
import Avatar from "../../db/Avatar";
import Packet from "../kcp/Packet";
import Session from "../kcp/Session";

export default async function handle(session: Session, packet: Packet) {
    const lineups: LineupInfo[] = [];
    for(const lineup of session.player.db.lineups) {
        const lineupInfo = lineup as unknown as LineupInfo;
        lineupInfo.avatarList = await Avatar.getLineup(session.player.db._id, lineupInfo.index);
        lineups.push(lineupInfo);
    }
    session.send("GetAllLineupDataScRsp", {
        retcode: 0,
        lineupList: lineups
    } as unknown as GetAllLineupDataScRsp);
}