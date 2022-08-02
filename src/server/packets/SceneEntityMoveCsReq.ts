import { SceneEntityMoveCsReq, SceneEntityMoveScRsp } from "../../data/proto/StarRail";
import { ActorEntity } from "../../game/entities/actor";
import Packet from "../kcp/Packet";
import Session from "../kcp/Session";

export default async function handle(session: Session, packet: Packet) {
    const body = packet.body as SceneEntityMoveCsReq;
    console.log(body.entryId);
    if(session.player.scene.entryId !== body.entryId){
        return;
    }
    for(const entityMotion of body.entityMotionList){
        console.log(entityMotion.entityId);
        const entity = session.player.scene.entities.get(entityMotion.entityId);
        if(!entity){ //what??
            session.player.scene.despawnEntity(entityMotion.entityId);
            continue;
        }
        const motion = entityMotion.motion;
        if(!motion){
            continue;
        }
        entity.pos = motion.pos!;
        entity.rot = motion.rot ?? {
            x: 0,
            y: 0,
            z: 0,
        }
        console.log("EntityMotion" + JSON.stringify(entityMotion, null, 2));
        if(entity instanceof ActorEntity){
            entity.mapLayer = entityMotion.mapLayer;
            session.player.db.posData.pos = motion.pos!;
            console.log("PlayerMotion" + JSON.stringify(session.player.db.posData));
        }
        console.log("Entity" + JSON.stringify(entity.getSceneEntityInfo(), null, 2));
    }

    session.send("SceneEntityMoveScRsp", {
        retcode: 0,
        downloadData: undefined,
    } as SceneEntityMoveScRsp);
}