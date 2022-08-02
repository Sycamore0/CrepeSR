import { GetGachaInfoScRsp } from "../../data/proto/StarRail";
import Packet from "../kcp/Packet";
import Session from "../kcp/Session";

const unix = () => Math.floor(Date.now() / 1000);

export default async function handle(session: Session, packet: Packet) {
    session.send("GetGachaInfoScRsp", {
        gachaRandom: 2503,
        retcode: 0,
        gachaInfoList: [{
            beginTime: unix(),
            endTime: unix() * 2,
            newbieGachaCnt: 10,
            todayGachaCnt: 1,
            gachaId: 763, // TODO: Figure out gachaIDs
            detailWebview: "https://omfgdogs.com/"
        }],
        todaySingleGachaMaxCnt: 10,
        todayTotalGachaCnt: 1,
    } as GetGachaInfoScRsp);
}