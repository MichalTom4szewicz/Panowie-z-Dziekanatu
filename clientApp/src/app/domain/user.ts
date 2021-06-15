import { Degree } from '../enums/degree';
import {Course} from './course';
import {Classes} from './classes';

export interface User {
    firstName: string;
    lastName: string;
    degree: Degree;
    username: string;
    courses?: Array<Course>;
    classes?: Array<Classes>;
}
