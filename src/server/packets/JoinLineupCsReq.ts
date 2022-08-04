import { AvatarType, JoinLineupCsReq, JoinLineupScRsp, SyncLineupNotify, SyncLineupReason } from "../../data/proto/StarRail";
import Avatar from "../../db/Avatar";
import Packet from "../kcp/Packet";
import Session from "../kcp/Session";

// JoinLineupCsReq { baseAvatarId: 1002, slot: 1 }
export default async function handle(session: Session, packet: Packet) {
    const body = packet.body as JoinLineupCsReq;
    session.send(JoinLineupScRsp, { retcode: 0 });

    // Replace avatar in the player's lineup.
    const slot = body.slot ?? 0;
    session.player.db.lineup.lineups[session.player.db.lineup.curIndex].avatarList[slot] = body.baseAvatarId;
    await session.player.save();

    session.send(SyncLineupNotify, {
        lineup: await session.player.getLineup(),
        reasonList: [SyncLineupReason.SYNC_REASON_NONE]
    } as SyncLineupNotify);
}