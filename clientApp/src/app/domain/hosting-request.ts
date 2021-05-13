import { Status } from "../enums/status";
import { Classes } from "./classes";
import { User } from "./user";

export interface HostingRequest {
    id: string,
    status: Status,
    user: User,
    class: Classes
}