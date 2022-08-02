import { EnterMazeCsReq, EnterMazeScRsp } from "../../data/proto/StarRail";
import MazePlaneExcel from "../../util/excel/MazePlaneExcel";
import Packet from "../kcp/Packet";
import Session from "../kcp/Session";

export default async function handle(session: Session, packet: Packet) {
    const body = packet.body as EnterMazeCsReq;

    const mazeEntry = MazePlaneExcel.fromEntryId(body.entryId);

    session.send("EnterMazeScRsp", {
        retcode: 0,
        maze: {
            floor: {
                floorId: mazeEntry.StartFloorID,
                scene: {
                    
                }
            },
            id: mazeEntry.PlaneID,
            mapEntryId: body.entryId,
        }
    } as EnterMazeScRsp);
}