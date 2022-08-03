import Logger from "../util/Logger";
import { ActorEntity } from "../game/entities/Actor";
import Interface, { Command } from "./Interface";
import Database from "../db/Database";
import { GetCurSceneInfoScRsp } from "../data/proto/StarRail";
import Session from "../server/kcp/Session";
import MazePlaneExcel from "../util/excel/MazePlaneExcel";
const c = new Logger("/scene", "blue");

export default async function handle(command: Command, session: Session) {
    if (!Interface.target) {
        c.log("No target specified");
        return;
    }

    const planeID = MazePlaneExcel.fromPlaneId(parseInt(command.args[0]))
    const uid = Interface.target.player.db._id;
    const posData = Interface.target.player.db.posData;
    
    const lineup2 = await Interface.target.player.getLineup();
    const curAvatarEntity = new ActorEntity(Interface.target.player.scene, lineup2.avatarList[0].id, posData.pos);

    if (!planeID) return c.log("Usage: /scene <planeID>");

    const db = Database.getInstance();
    await db.update('players',{_id:uid},{posData: { floorID: Number(planeID!.StartFloorID), planeID: Number(planeID!.PlaneID)}})
    await Interface.target.player.save()

    //ty for tamilpp25 scene
    Interface.target.send(GetCurSceneInfoScRsp, {
        retcode: 0,
        scene: {
            planeId: Number(planeID!.PlaneID),
            floorId: Number(planeID!.StartFloorID),
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
    Interface.target.player.scene.spawnEntity(curAvatarEntity, true);

    Interface.target.sync();
}
