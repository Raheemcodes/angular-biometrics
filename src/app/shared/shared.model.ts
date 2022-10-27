export interface AuthState {
  user: User;
  authError: string;
  authSuccess: string;
  loading: boolean;
}

export class User {
  constructor(
    public id: string,
    public username: string,
    private _token: string,
    private _tokenExpirationDate: Date
  ) {}

  get token() {
    if (!this._tokenExpirationDate || new Date() > this._tokenExpirationDate) {
      return null;
    }
    return this._token;
  }
}

export interface AppState {
  auth: AuthState;
}

export interface AuthResponseData {
  id: string;
  name: string;
  token: string;
  expiresIn: number;
  message: string;
}

export interface GraphqlHTTPErrorResponse {
  message: string;
  data?: string;
  statusCode?: string;
}

export interface PubCredential extends PublicKeyCredential {
  readonly rawId: ArrayBuffer;
  readonly response: AuthenticatorAttestationResponse;
}

export interface PubRequestCredential extends PublicKeyCredential {
  readonly id: string;
  readonly response: AuthenticatorAssertionResponse;
}

export interface EncodedPubCredential {
  readonly response: {
    clientDataJSON: string;
    attestationObject: string;
  };
}

export const bufferToBase64URLString = (buffer: ArrayBuffer): string => {
  const bytes: Uint8Array = new Uint8Array(buffer);
  let str: string = '';

  for (const charCode of bytes) {
    str += String.fromCharCode(charCode);
  }

  const base64String: string = btoa(str);

  return base64String.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
};

export const base64URLStringToBuffer = (
  base64URLString: string
): ArrayBuffer => {
  // Convert from Base64URL to Base64
  const base64: string = base64URLString.replace(/-/g, '+').replace(/_/g, '/');
  /**
   * Pad with '=' until it's a multiple of four
   * (4 - (85 % 4 = 1) = 3) % 4 = 3 padding
   * (4 - (86 % 4 = 2) = 2) % 4 = 2 padding
   * (4 - (87 % 4 = 3) = 1) % 4 = 1 padding
   * (4 - (88 % 4 = 0) = 4) % 4 = 0 padding
   */
  const padLength: number = (4 - (base64.length % 4)) % 4;
  const padded: string = base64.padEnd(base64.length + padLength, '=');

  // Convert to a binary string
  const binary: string = atob(padded);

  // Convert binary string to buffer
  const buffer: ArrayBuffer = new ArrayBuffer(binary.length);
  const bytes: Uint8Array = new Uint8Array(buffer);

  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }

  return buffer;
};
