import { User } from "./user";

export interface Course {
    name: string,
    courseKey: string,
    supervisor: User
}
