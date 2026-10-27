export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: 'donor' | 'requester';
  donatedTotal: number;
  billsHelpedCount: number;
}

export interface Bill {
  id: string;
  userId: string;
  firstName: string;
  billerName: string;
  amount: number;
  raised: number;
  dueDate: string;
  category: 'utilities' | 'medical' | 'rent' | 'education' | 'emergency' | 'other';
  story: string;
  status: 'active' | 'funded' | 'verified' | 'flagged';
  piiScrubbed: boolean;
  isVerified: boolean;
  fraudRiskScore: number;
  originalImageEncrypted?: string;
  redactedImageUrl?: string;
  donorsCount: number;
  createdAt: string;
}

export interface Contribution {
  id: string;
  billId: string;
  donorId: string;
  donorName: string;
  amount: number;
  billerName: string;
  recipientFirstName: string;
  message?: string;
  timestamp: string;
}

export interface AuditLogItem {
  id: string;
  action: string;
  userId: string;
  details: string;
  timestamp: string;
}
