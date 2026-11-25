export interface AuthUser {
  id: string;
  email: string;
  createdAt: string;
}

export interface AuthResponse {
  accessToken: string;
  tokenType: 'Bearer';
  user: AuthUser;
}

export interface ContractOption {
  termMonths: number;
  monthlyPaymentCents: number;
  totalPayableCents: number;
  totalInterestCents: number;
}

export interface Contract {
  id: string;
  principalCents: number;
  annualRate: number;
  options: ContractOption[];
  createdAt: string;
  updatedAt: string;
}

export interface ContractListResponse {
  data: Contract[];
  nextCursor: string | null;
}

export interface UpdateContractInput {
  id: string;
  principalCents: number;
  expectedUpdatedAt: string;
}
