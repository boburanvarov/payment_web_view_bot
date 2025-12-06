// Currency interfaces

export interface CurrencyInfo {
    currency: string;
    currencyName: string;
    flagUrl: string;
    amount: number;
}

export interface BestOffer {
    id: number;
    bankName: string;
    bankCode: string | null;
    logoUrl: string;
    sellRate: number;
    buyRate: number;
}

export interface CurrencyOverviewResponse {
    base: CurrencyInfo;
    quote: CurrencyInfo;
    rate: number;
    updatedAt: string;
    bestOffers: BestOffer[];
}

