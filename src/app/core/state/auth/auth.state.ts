import { User } from '../../models/User';

export interface AuthState {
  user: User | undefined | null;
  loading: boolean;
  error: string | null;
}

export const initialAuthState: AuthState = {
  user: null,
  loading: false,
  error: null,
};
