/**
 * Auth Service Module
 * Handles Firebase Auth and user profile state.
 */

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: 'donor' | 'requester';
  donatedTotal: number;
  billsHelpedCount: number;
}

// Simulated active user for seamless preview experience
let currentUser: UserProfile | null = {
  uid: 'user_demo_123',
  email: 'generous.donor@example.com',
  displayName: 'Alex Morgan',
  role: 'donor',
  donatedTotal: 165.00,
  billsHelpedCount: 3,
};

export const authService = {
  getCurrentUser(): UserProfile | null {
    return currentUser;
  },

  async signIn(email: string, role: 'donor' | 'requester' = 'donor'): Promise<UserProfile> {
    await new Promise(resolve => setTimeout(resolve, 600));
    currentUser = {
      uid: `user_${Date.now()}`,
      email,
      displayName: email.split('@')[0],
      role,
      donatedTotal: 50.00,
      billsHelpedCount: 1,
    };
    return currentUser;
  },

  async signOut(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
    currentUser = null;
  },
};
