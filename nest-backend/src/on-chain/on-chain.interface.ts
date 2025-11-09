export interface Details {
    name: string;
    id: string;
}

export type TokenDetails = Details & {decimal: string; symbol: string}

export interface TransactOnChain {
    // chainDetails: Details;
    // tokenDetails: TokenDetails;

    rewardContributor(address: string, amount: string): Promise<object>;
    getAddressBalance(address: string): Promise<string>;
}
