import { BattleAvatar, BattleEndStatus, GetCurBattleInfoScRsp } from "../../data/proto/StarRail";
import Avatar from "../../db/Avatar";
import Packet from "../kcp/Packet";
import Session from "../kcp/Session";

export default async function handle(session: Session, packet: Packet) {
    let avatars = session.player.avatars;
    if (!avatars) {
        avatars = await Avatar.create(session.player.db._id);
        session.player.avatars = avatars;
        session.player.save();
    }

    session.send("GetCurBattleInfoScRsp", {
        retcode: 0,
        avatarList: avatars.map(avatar => {
            const battleAvatar = avatar as unknown as BattleAvatar;
            battleAvatar.id = avatar.baseAvatarId;
            battleAvatar.index = 1;
            return battleAvatar
        }),
        stageId: 10000,
        logicRandomSeed: 2503,
        battleInfo: {},
        lastEndStatus: BattleEndStatus.BATTLE_END_WIN,
        lastEventId: 0
    } as GetCurBattleInfoScRsp);
}