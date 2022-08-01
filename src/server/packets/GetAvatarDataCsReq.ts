import { GetAvatarDataCsReq, GetAvatarDataScRsp } from "../../data/proto/StarRail";
import Avatar from "../../db/Avatar";
import Packet from "../kcp/Packet";
import Session from "../kcp/Session";

export default async function handle(session: Session, packet: Packet) {
    const body = packet.body as GetAvatarDataCsReq;

    let avatars = session.player.db.avatars;
    if (!avatars) {
        avatars = await Avatar.create(session.player.db._id);
        session.player.db.avatars = avatars;
        session.player.save();
    }

    const dataObj = {
        retcode: 0,
        avatarList: avatars.map(avatar => avatar as Avatar),
        isAll: body.isGetAll
    } as GetAvatarDataScRsp;

    session.send("GetAvatarDataScRsp", dataObj);
}