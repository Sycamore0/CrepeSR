//ts-proto generated types required, import them here
import * as types from "../data/proto/StarRail";
import protobufjs from "protobufjs";
import { CmdID, PacketName } from "../server/kcp/Packet"
import Logger from "./Logger";
const c = new Logger("ProtoFactory");

class MessageType<T> {
    "encode": (arg0: T) => protobufjs.Writer;
    "fromPartial": (arg0: object) => T;
    // "decode": (input: protobufjs.Reader | Uint8Array, length?: number)=> T;
    // "fromJSON": (object: any)=>T;
    // "toJSON": (message: T)=> unknown
    //you can add more fields here from the generated types
    //fromjson etc...
}

const messageTypeMap = new Map<PacketName, MessageType<any>>();
const messageTypeMapReversed = new Map<MessageType<any>, PacketName>();

function send<Class extends MessageType<T>, T>(type: Class, data: T) {
    console.log(type.encode(data).finish())
}


function isMessageType<T>(pet: MessageType<T> | any): pet is MessageType<T> {
    return (<MessageType<T>>pet).encode !== undefined;
}


export default class ProtoFactory {

    // ONLY USE THIS IF YOU'RE DECODING SOMETHING DONT USE IT TO SEND SHIT
    // BECAUSE THEN YOU FUCK YOUR TYPECHECKING

    static getType(name: PacketName) {
        return messageTypeMap.get(name) as MessageType<any>;
    }

    static getName(type: MessageType<any>) {
        return messageTypeMapReversed.get(type) as PacketName;
    }

    static init() {
        //iterate over everything in types and check if they are a MessageType
        for (const key of Object.keys(types)) {
            const value = types[key as keyof typeof types];
            if (isMessageType(value)) {
                if (Object.values(CmdID).includes(key)) {
                    messageTypeMap.set(key as PacketName, value);
                    messageTypeMapReversed.set(value, key as PacketName);
                } else {
                    // there are some types that are not packets, but are still MessageType
                    // you can figure out what you want to do with them here
                }
            }
        }

        c.debug(`Initialized with ${messageTypeMap.size} types`);

        //c.log(this.getName(types.PlayerLoginScRsp))
        return;

        //if you want a partial type
        send(types.PlayerLoginScRsp, types.PlayerLoginScRsp.fromPartial({
            basicInfo: {
                exp: 0,
                level: 1,
                hcoin: 0,
                mcoin: 0,
                nickname: "test",
                scoin: 0,
                stamina: 100,
                worldLevel: 1,
            },
            isNewPlayer: true,
            stamina: 100,
            curTimezone: 1,
            serverTimestampMs: Math.round(new Date().getTime() / 1000),
        }))
    }
}




