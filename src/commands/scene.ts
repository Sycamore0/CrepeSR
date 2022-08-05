import Logger from "../util/Logger";
import { ActorEntity } from "../game/entities/Actor";
import Interface, { Command } from "./Interface";
import { GetCurSceneInfoScRsp } from "../data/proto/StarRail";
import MazePlaneExcel from "../util/excel/MazePlaneExcel";
const c = new Logger("/scene", "blue");

export default async function handle(command: Command) {
    if (!Interface.target) {
        c.log("No target specified");
        return;
    }

    if(command.args.length == 0){
        c.log("Usage: /scene <planeID|floorID>");
        return;
    }

    const plane = MazePlaneExcel.fromFloorId(parseInt(command.args[0])) || MazePlaneExcel.fromPlaneId(parseInt(command.args[0])) //Get plane data
    let floorId = 10001001 // Default floor data

    if(plane!){
        if(command.args[0].length === 5){//PLANE ID LOGIC
            floorId = plane.StartFloorID;
        }else if(command.args[0].length === 8){//FLOOR ID LOGIC
            if(plane! && plane.FloorIDList.includes(parseInt(command.args[0]))){
                floorId = parseInt(command.args[0]);
            }else{
                c.error("cannot find Scene data!");
                return;
            }
        }else{
            c.error("Invalid FloorID / PlaneID length!");
            return;
        }
    }else{
        c.error("cannot find Scene data!");
        return;
    }

    const posData = Interface.target.player.db.posData;
    
    const lineup = await Interface.target.player.getLineup();
    const curAvatarEntity = new ActorEntity(Interface.target.player.scene, lineup.leaderSlot, posData.pos);

    const planeId = parseInt(floorId.toString().slice(0,5));

    // Update scene information on player.
    Interface.target.player.db.posData.planeID = planeID!.PlaneID;
    Interface.target.player.db.posData.floorID = planeID!.StartFloorID;
    await Interface.target.player.save()

    Interface.target.send(GetCurSceneInfoScRsp, {
        retcode: 0,
        scene: {
            planeId: planeId,
            floorId: floorId,
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

    c.log(`Scene set to floorId: ${floorId}`);
}
