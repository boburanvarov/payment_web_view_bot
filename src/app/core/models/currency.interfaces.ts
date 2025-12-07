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

// Currency Pair Offer
export interface CurrencyPairOffer {
    id: number;
    bankName: string;
    bankCode: string;
    logoUrl: string;
    sellRate: number;
    buyRate: number;
    displayOrder: number;
    active: boolean;
}

// Currency Pair from /api/currency/pairs
export interface CurrencyPair {
    id: number;
    baseCurrency: string;
    baseCurrencyName: string;
    baseFlagUrl: string;
    quoteCurrency: string;
    quoteCurrencyName: string;
    quoteFlagUrl: string;
    rate: number;
    baseAmount: number;
    active: boolean;
    updatedAt: string;
    offers: CurrencyPairOffer[];
}


