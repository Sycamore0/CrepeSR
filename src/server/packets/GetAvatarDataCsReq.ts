import { Avatar, GetAvatarDataCsReq, GetAvatarDataScRsp } from "../../data/proto/StarRail";
import Packet from "../kcp/Packet";
import Session from "../kcp/Session";

export default async function handle(session: Session, packet: Packet) {
    const body = packet.body as GetAvatarDataCsReq;

    const dataObj = {
        retcode: 0,
        avatarList: session.player.db.avatars.map(avatar => {
            return avatar as unknown as Avatar
        }),
        isAll: body.isGetAll
    } as GetAvatarDataScRsp;

    session.send("GetAvatarDataScRsp", dataObj);
}