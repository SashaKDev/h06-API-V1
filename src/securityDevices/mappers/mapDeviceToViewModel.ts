import {SessionType} from "../../auth/types/sessionType.js";
import {DeviceViewModel} from "../types/deviceViewModel.js";
import {WithId} from "mongodb";

export const mapDeviceToViewModel = (session: WithId<SessionType>): DeviceViewModel => {

    return {
        ip: session.ip,
        title: session.deviceName,
        lastActiveDate: new Date(session.iat * 1000).toISOString(),
        deviceId: session.deviceId,
    }

}