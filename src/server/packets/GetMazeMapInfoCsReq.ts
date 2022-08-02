import { GetMazeMapInfoScRsp } from "../../data/proto/StarRail";
import Packet from "../kcp/Packet";
import Session from "../kcp/Session";

export default async function handle(session: Session, packet: Packet) {
    const body = packet.body as GetMazeMapInfoScRsp;

    const dataObj = {
        retcode: 0,
        entryId: body.entryId,
        lightenSectionList: [],
        mazePropList: [{ groupId: 0, configId: 0, state: 0 }],
        mazeGroupList: [{ groupId: 0, modifyTime: 0 }],
        opendChestNum: 0,
        unlockTeleportList: []
    } as GetMazeMapInfoScRsp;

    // TODO: No excel info atm
    for (let i = 0; i < 20; i++) {
        dataObj.lightenSectionList.push(i)
    }

    session.send("GetMazeMapInfoScRsp", dataObj);
}