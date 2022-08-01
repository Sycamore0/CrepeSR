import { AvatarType, GetCurLineupDataCsReq, GetCurLineupDataScRsp, LineupAvatar } from "../../data/proto/StarRail";
import Packet from "../kcp/Packet";
import Session from "../kcp/Session";

export default async function handle(session: Session, packet: Packet) {
    session.send("GetCurLineupDataScRsp", {
        retcode: 0,
        lineup: {
            avatarList: session.player.db.avatars.map(avatar => {
                const battleAvatar = avatar as unknown as LineupAvatar;
                battleAvatar.id = avatar.baseAvatarId;
                battleAvatar.slot = 1;
                return battleAvatar
            }),
            index: 1,
            isVirtual: false,
            mp: 100,
            name: "lineuprspname",
            planeId: 10000,
            leaderSlot: 1
        }
    } as GetCurLineupDataScRsp);
}