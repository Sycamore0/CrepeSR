import { GetCurLineupDataScRsp } from "../../data/proto/StarRail";
import Avatar from "../../db/Avatar";
import Packet from "../kcp/Packet";
import Session from "../kcp/Session";

export default async function handle(session: Session, packet: Packet) {
    let lineup = await session.player.getLineup();

    session.send("GetCurLineupDataScRsp", {
        retcode: 0,
        lineup: {
            ...lineup,
        }
    } as GetCurLineupDataScRsp);
}