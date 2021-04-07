import { hash } from 'bcrypt';

export class EncryptionHelper {
  public static async encryptPassword(password: string): Promise<string> {
    return hash(password, 2);
  }
}
