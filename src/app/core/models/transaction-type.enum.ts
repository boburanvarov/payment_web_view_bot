/**
 * Enum for transaction filter types
 * Used for filtering transactions in overview and reports
 */
export enum TransactionFilterType {
    ALL = 'ALL',
    INCOME = 'INCOME',
    EXPENSE = 'EXPENSE'
}

/**
 * Labels for transaction filter types (Uzbek language)
 */
export const TransactionFilterLabels: Record<TransactionFilterType, string> = {
    [TransactionFilterType.ALL]: 'Barchasi',
    [TransactionFilterType.INCOME]: 'Kirim',
    [TransactionFilterType.EXPENSE]: 'Chiqim'
};

/**
 * Get all transaction filter options for radio buttons
 */
export function getTransactionFilterOptions(): { value: TransactionFilterType; label: string }[] {
    return Object.values(TransactionFilterType).map(type => ({
        value: type,
        label: TransactionFilterLabels[type]
    }));
}
