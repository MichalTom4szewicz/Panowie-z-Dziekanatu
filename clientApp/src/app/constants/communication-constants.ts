export class CommunicationConstants {
  private static readonly _AUTH_API_ADDRESS = 'https://127.0.0.1:4848';
  private static readonly _DATA_API_ADDRESS = 'http://127.0.0.1:8000';

  private static get authApiAddress(): string {
    return CommunicationConstants._AUTH_API_ADDRESS;
  }

  private static get dataApiAddress(): string {
    return CommunicationConstants._DATA_API_ADDRESS;
  }

  public static getFullAuthApiAddress(endpoint: string): string {
    return CommunicationConstants.authApiAddress.concat(endpoint);
  }

  public static getFullDataApiAddress(endpoint: string): string {
    return CommunicationConstants.dataApiAddress.concat(endpoint);
  }
}
