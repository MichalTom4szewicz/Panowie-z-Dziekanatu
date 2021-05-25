import { Degree } from "../enums/degree";

export interface User {
    firstName: string,
    lastName: string,
    degree: Degree,
    username: string
}
