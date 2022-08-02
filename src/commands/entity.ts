import { Vector } from "../data/proto/StarRail";
import { ActorEntity } from "../game/entities/actor";
import { MonsterEntity } from "../game/entities/monster";
import { NpcEntity } from "../game/entities/npc";
import { PropEntity } from "../game/entities/prop";
import Logger from "../util/Logger";
import Interface, { Command } from "./Interface";
const c = new Logger("/entity", "blue");

export default async function handle(command: Command) {
    if (!Interface.target) {
        c.log("No target specified");
        return;
    }

    const player = Interface.target.player;
    const entityType = command.args[0];
    const id = Number(command.args[1]);
    let entity;

    switch (entityType) {
        default:
            c.log(`Usage: /entity <actor|npc|monster|prop> <id>`);
            return;
        case "actor":
            entity = new ActorEntity(player.scene, id, player.db.posData.pos);
            break;
        case "npc":
            entity = new NpcEntity(player.scene, id, player.db.posData.pos);
            player.scene.spawnEntity(entity);
            break;
        case "monster":
            entity = new MonsterEntity(player.scene, id, player.db.posData.pos);
            player.scene.spawnEntity(entity);
            break;
        case "prop":
            entity = new PropEntity(player.scene, id, player.db.posData.pos);
            player.scene.spawnEntity(entity);
            break;
    }
    console.log(JSON.stringify(entity.getSceneEntityInfo(), null, 2));
    player.scene.spawnEntity(entity);
}