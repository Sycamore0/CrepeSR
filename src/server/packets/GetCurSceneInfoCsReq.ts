import { GetCurSceneInfoScRsp } from "../../data/proto/StarRail";
import Packet from "../kcp/Packet";
import Session from "../kcp/Session";

export default async function handle(session: Session, packet: Packet) {
    const posData = session.player.db.posData;
    session.send("GetCurSceneInfoScRsp", {
        retcode: 0,
        scene: {
            planeId: posData.planeID,
            floorId: posData.floorID,
            entityList: [],
            entityBuffList: [],
            entryId: 10001,
            envBuffList: [],
            gameModeType: 1,
            lightenSectionList: []
        },
    } as unknown as GetCurSceneInfoScRsp);
}