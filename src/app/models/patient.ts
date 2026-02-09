import { Identifier } from './identifier';

export interface Patient {
  id: string;
  createdAt: string;
  updatedAt: string;
  firstName?: string;
  lastName?: string;
  dob?: string;
  gender?: string;
  phoneNo?: string;
  email?: string;
  emailNorm?: string;
  address?: string;
  suburb?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  linkStatus?: string;
  confidenceScore?: number;
  externalPatientId?: string;
  systemId?: string | null;
  systemCode?: string;
  systemName?: string;
  identifiers?: Identifier[];
}
