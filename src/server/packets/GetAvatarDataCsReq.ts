import { GetAvatarDataCsReq, GetAvatarDataScRsp } from "../../data/proto/StarRail";
import AvatarExcelTable from "../../data/excel/AvatarExcelTable.json";
import Packet from "../kcp/Packet";
import Session from "../kcp/Session";
import Avatar from "../../db/Avatar";

export default async function handle(session: Session, packet: Packet) {
    const body = packet.body as GetAvatarDataCsReq;

    const avatar = await Avatar.fromUID(session.player.db._id);

    const dataObj = {
        retcode: 0,
        avatarList: avatar.map(av => av.data),
        isAll: body.isGetAll
    } as GetAvatarDataScRsp;

    Object.values(AvatarExcelTable).forEach(avatar => {
        // dataObj.avatarList.push()
    });

    session.send("GetAvatarDataScRsp", dataObj);
}