// Transaction interfaces

export interface Transaction {
    date: string;
    time: string;
    type: 'income' | 'expense';
    cardNumber: string;
    amount: number;
    description: string;
    processingLogoMini?: string;
}

export interface TransactionGroup {
    date: string;
    transactions: Transaction[];
}

export interface BinInfo {
    cardType: string;
    bankName: string;
    bankLogo?: string;
    bankLogoMini?: string;
    bankWhiteLogo?: string;
    bankWhiteLogoMini?: string;
    processingLogo?: string;
    processingLogoMini?: string;
    processingWhiteLogo?: string;
    processingWhiteLogoMini?: string;
}

export interface HomePageTransaction {
    id: number;
    userId: number;
    phoneNumber: string;
    createDate: string;
    refNumber: string;
    tranType: '+' | '-';
    tranDateTime: string;
    tranAmount: number;
    totalBalance: number;
    tranCurrency: string;
    merchant: string;
    terminal: string;
    cardType: string;
    merchantName: string;
    merchantAddress: string;
    maskPan: string;
    cardId: string;
    bin: BinInfo;
    category: string;
    description: string;
    mccLogoUrl: string;
    reversal: boolean;
}

export interface HomePageReportResponse {
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
    incomeAmount: number;
    expensesAmount: number;
    period: string;
    content: HomePageTransaction[];
}

export interface OverviewTransaction {
    id: number;
    tranType: '+' | '-';
    amount: number;
    balanceAfter: number;
    currency: string;
    merchant: string;
    merchantName: string;
    merchantAddress: string;
    terminal: string;
    cardType: string;
    cardId: string;
    maskPan: string;
    bin: BinInfo;
    mccCode: string;
    category: string;
    categoryDescription: string;
    mccLogoUrl: string;
    transactedAt: string;
    reversal: boolean;
}

export interface OverviewReportResponse {
    summary: {
        income: number;
        expenses: number;
        startDate: string;
        endDate: string;
    };
    page: {
        page: number;
        size: number;
        totalElements: number;
        totalPages: number;
        hasNext: boolean;
        hasPrevious: boolean;
    };
    transactions: OverviewTransaction[];
}

