import Avatar from "../db/Avatar";
import Logger from "../util/Logger";
import Interface, { Command } from "./Interface";
const c = new Logger("/avatar", "blue");

const usage = () => c.log("Usage: /avatar <add|del> <avatarId>");

export default async function handle(command: Command) {
    if (!Interface.target) return c.log("No target specified");

    const mode = command.args[0];
    const avatarId = command.args[1];

    if (!avatarId || !mode) return usage();

    switch (mode) {
        case "add":
            const avatar = await Avatar.add(Interface.target.player.db._id, Number(avatarId));
            c.log(`Added avatar ${avatar.baseAvatarId} to ${Interface.target.player.db.name}`);
            break;
        case "del":
            Avatar.remove(Interface.target.player.db._id, Number(avatarId));
            c.log(`Removed avatar ${avatarId} from ${Interface.target.player.db.name}`);
            break;
        default:
            return usage();
    }
}