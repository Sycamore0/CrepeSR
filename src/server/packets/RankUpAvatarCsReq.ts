import { RankUpAvatarCsReq, RankUpAvatarScRsp } from "../../data/proto/StarRail";
import Avatar from "../../db/Avatar";
import Logger from "../../util/Logger";
import Packet from "../kcp/Packet";
import Session from "../kcp/Session";
const c = new Logger("RankUpAvatarCsReq");

export default async function handle(session: Session, packet: Packet) {
    const body = packet.body as RankUpAvatarCsReq;

    let retcode = 0;
    if (body.costData) {
        const inv = await session.player.getInventory();

        for (const item of body.costData.itemList) {
            if (!item.pileItem) return;

            const succ = await inv.payItems([{
                count: item.pileItem.itemNum,
                id: item.pileItem.itemId,
            }]);

            if (!succ) {
                retcode = 1301;
                c.debug(`failed to pay item ${item.pileItem.itemId}`, item.pileItem);
                break;
            }
        }
    }

    if (retcode === 0) {
        const avatar = await Avatar.loadAvatarForPlayer(session.player, body.baseAvatarId);
        avatar.db.rank = body.rank // gidra moment: ez hack
        await avatar.save();
    }

    session.send(RankUpAvatarScRsp, { retcode });
    session.sync();
}