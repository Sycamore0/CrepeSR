import { GetCurSceneInfoScRsp } from "../../data/proto/StarRail";
import Packet from "../kcp/Packet";
import Session from "../kcp/Session";

export default async function handle(session: Session, packet: Packet) {
    session.send("GetCurSceneInfoScRsp", {
        retcode: 0,
        scene: {
            planeId: session.player.db.planeId,
            floorId: session.player.db.floorId,
            entityList: [],
            entityBuffList: [],
            entryId: 10001, //TODO: hardcoded, find out what does this mean
            envBuffList: [],
            gameModeType: 1, //TODO: hardcoded, find out what does this mean
            lightenSectionList: []
        },
    } as unknown as GetCurSceneInfoScRsp);
}