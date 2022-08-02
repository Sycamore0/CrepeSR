import { AvatarType, JoinLineupCsReq, SyncLineupNotify, SyncLineupReason } from "../../data/proto/StarRail";
import Avatar from "../../db/Avatar";
import Packet from "../kcp/Packet";
import Session from "../kcp/Session";

// JoinLineupCsReq { baseAvatarId: 1002, slot: 1 }
export default async function handle(session: Session, packet: Packet) {
    const body = packet.body as JoinLineupCsReq;
    session.send("JoinLineupScRsp", { retcode: 0 });

    let lineup = session.player.getCurLineup();
    const slot = body.slot || 0;
    const avatar = await Avatar.fromUID(session.player.db._id, body.baseAvatarId);
    if (avatar.length === 0) return session.c.warn(`Avatar ${body.baseAvatarId} not found`);
    lineup.avatarList[slot] = {
        avatarType: AvatarType.AVATAR_FORMAL_TYPE,
        hp: 10000,
        id: body.baseAvatarId,
        satiety: 100,
        slot,
        sp: 10000
    };
    session.player.setCurLineup(lineup);
    session.player.save();

    session.send("SyncLineupNotify", {
        lineup: lineup,
        reasonList: [SyncLineupReason.SYNC_REASON_NONE]
    } as SyncLineupNotify);
}