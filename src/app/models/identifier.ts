export interface Identifier {
  id: string;
  type: string;
  value: string;
  issuingAuthority?: string;
  verified?: boolean;
}
