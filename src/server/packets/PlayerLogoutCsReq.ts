import Packet from "../kcp/Packet";
import Session from "../kcp/Session";
import SRServer from "../kcp/SRServer";

export default async function handle(session: Session, packet: Packet) {
    // Remove from session list & save their data
    session.player.save();
    SRServer.getInstance().sessions.delete(`${session.ctx.address}:${session.ctx.port}`);
}