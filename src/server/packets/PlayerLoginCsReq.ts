import { LineupAvatar, LineupInfo, PlayerBasicInfo, PlayerLoginCsReq, PlayerLoginScRsp } from "../../data/proto/StarRail";
import Avatar from "../../db/Avatar";
import Player from "../../db/Player";
import Packet from "../kcp/Packet";
import Session from "../kcp/Session";

// { Example body:
//     platform: 3,
//     deviceUuid: '406d064a8fa3bcb32f1d88df28e600e5a86bbf751658757874371',
//     deviceInfo: '{"operatingSystem":"Windows 10  (10.0.19043) 64bit","deviceModel":"B450M DS3H V2 (Gigabyte Technology Co., Ltd.)","graphicsDeviceName":"NVIDIA GeForce GTX 1650","graphicsDeviceType":"Direct3D11","graphicsDeviceVendor":"NVIDIA","graphicsDeviceVersion":"Direct3D 11.0 [level 11.1]","graphicsMemorySize":3962,"processorCount":12,"processorFrequency":3394,"processorType":"AMD Ryzen 5 2600 Six-Core Processor ","systemMemorySize":16335,"DeviceSoC":""}',
//     systemInfo: 'Windows 10  (10.0.19043) 64bit',
//     clientVersion: 'OSCBWin0.70.0',
//     language: 3,
//     checkSum_1: 'ff07bc743a394e0ff1c163edc663137d',
//     checkSum_2: 'ca590da88620492b921c9b3b4977f1be10',
//     resolution: '1920*1080',
//     systemLanguage: 'Dutch',
//     resVersion: 611127,
//     clientTimeZone: '01:00:00'
// }

export default async function handle(session: Session, packet: Packet) {
    const body = packet.body as PlayerLoginCsReq;

    const plr = await Player.fromUID(session.player.db._id)!;
    if (!plr) return;
    
    if (!plr.db.basicInfo) {
        plr.db.basicInfo = {
            exp: 0,
            level: 1,
            hcoin: 0,
            mcoin: 0,
            nickname: plr.db.name,
            scoin: 0,
            stamina: 100,
            worldLevel: 1,
        }
    }

    let avatars = plr.avatars;
    if (!avatars) {
        avatars = await Avatar.create(plr.db._id);
        plr.avatars = avatars;
    }

    let lineups = plr.db.lineups;
    if (!lineups) {
        let slot = 0;
        lineups = [
            {
                avatarList: avatars.map(avatar => {
                    const lineupAvatar = avatar as unknown as LineupAvatar;
                    lineupAvatar.id = avatar.baseAvatarId;
                    lineupAvatar.slot = slot++;
                    return lineupAvatar;
                }),
                index: 0,
                isVirtual: false, //TODO: find out what is this
                leaderSlot: 0,
                mp: 0, //TODO: find out what is this
                name: "Default",
            } as LineupInfo
        ];
        plr.db.lineups = lineups;
    }

    if (!plr.db.floorId) plr.db.floorId = 10000000;
    if (!plr.db.planeId) plr.db.planeId = 10000;

    plr.save();

    session.send("PlayerLoginScRsp", {
        basicInfo: plr.db.basicInfo as PlayerBasicInfo,
        isNewPlayer: false,
        stamina: 100,
        retcode: 0,
        isRelay: false,
        loginRandom: Number(body.loginRandom),
        serverTimestampMs: Math.round(new Date().getTime() / 1000),
    } as PlayerLoginScRsp);
}