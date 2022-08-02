import { GetCurSceneInfoScRsp, Vector } from "../../data/proto/StarRail";
import { ActorEntity } from "../../game/entities/actor";
import Packet from "../kcp/Packet";
import Session from "../kcp/Session";

export default async function handle(session: Session, packet: Packet) {
    const posData = session.player.db.posData;
    const _lineup = session.player.db.lineup;
    const lineup = _lineup.lineups[_lineup.curIndex];
    const curAvatar = lineup.avatarList.find(avatar => avatar.slot === 0);
    const pos = posData.pos;
    const curAvatarEntity = new ActorEntity(session.player.scene, curAvatar!.id, posData.pos as Vector);
    session.send("GetCurSceneInfoScRsp", {
        retcode: 0,
        scene: {
            planeId: posData.planeID,
            floorId: posData.floorID,
            entityList: [
                curAvatarEntity
            ],
            entityBuffList: [], 
            entryId: 10001,
            envBuffList: [],
            gameModeType: 1,
            lightenSectionList: []
        },
    } as unknown as GetCurSceneInfoScRsp);
    session.player.scene.spawnEntity(curAvatarEntity, true);
    session.player.scene.entryId = 10001;
}