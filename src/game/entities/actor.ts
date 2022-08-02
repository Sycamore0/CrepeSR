import { AvatarType, EntityType, MotionInfo, SceneActorInfo, SceneEntityInfo, Vector } from "../../data/proto/StarRail";
import { Scene } from "../scene";
import { Entity } from "./entity";

export class ActorEntity extends Entity
{
    public mapLayer: number = 0;

    constructor(readonly scene: Scene, public readonly avatarId: number, public pos: Vector, public rot?: Vector){
        super(scene, pos, rot);
    }

    public getSceneEntityInfo(): SceneEntityInfo {
        const sceneEntityInfo = super.getSceneEntityInfo();
        sceneEntityInfo.actor = {
            avatarType: AvatarType.AVATAR_FORMAL_TYPE,
            baseAvatarId: this.avatarId,
            uid: this.scene.player.db._id,
            mapLayer: 0 //?
        };
        return sceneEntityInfo;
    }

    public getEntityType(): EntityType {
        return EntityType.ENTITY_AVATAR;
    }

}