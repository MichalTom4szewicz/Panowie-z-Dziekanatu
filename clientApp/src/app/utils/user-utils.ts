import { User } from "../domain/user";

export class UserUtils {
    public static displayUser(user: User): string {
        return user.degree + ' ' + user.firstName + ' ' + user.lastName;
    }
}
