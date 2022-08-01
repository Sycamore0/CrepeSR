import { AvatarType, BattleAvatar, BattleEndStatus, GetCurBattleInfoScRsp } from "../../data/proto/StarRail";
import Packet from "../kcp/Packet";
import Session from "../kcp/Session";

export default async function handle(session: Session, packet: Packet) {
    session.send("GetCurBattleInfoScRsp", {
        retcode: 0,
        avatarList: session.player.db.avatars.map(avatar => {
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