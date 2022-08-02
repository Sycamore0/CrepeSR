import { GetMissionDataScRsp, MissionStatus } from "../../data/proto/StarRail";
import Packet from "../kcp/Packet";
import Session from "../kcp/Session";

export default async function handle(session: Session, packet: Packet) {
    session.send("GetMissionDataScRsp", {
        retcode: 0,
        missionList: [{
            id: 3010201,
            progress: 0,
            status: MissionStatus.MISSION_DOING
        },
        {
            id: 3010202,
            progress: 0,
            status: MissionStatus.MISSION_DOING
        },
        {
            id: 3010203,
            progress: 0,
            status: MissionStatus.MISSION_DOING
        },
        {
            id: 3010204,
            progress: 0,
            status: MissionStatus.MISSION_DOING
        },
        {
            id: 3010205,
            progress: 0,
            status: MissionStatus.MISSION_DOING
        }]
    } as GetMissionDataScRsp);
}