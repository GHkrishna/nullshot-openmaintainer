import { Details, TokenDetails, TransactOnChain } from "./on-chain.interface";
import { createThirdwebClient, fromGwei, prepareContractCall, readContract, sendTransaction, ThirdwebClient, ThirdwebContract, toEther, toWei } from "thirdweb";
import { getContract } from "thirdweb";
import { monadTestnet } from "thirdweb/chains";
import { Account, inAppWallet } from "thirdweb/wallets";
import { balanceOf } from "thirdweb/extensions/erc20";



export class OnChainTransaction implements TransactOnChain {
    private client: ThirdwebClient;
    private contract: ThirdwebContract;
    private account: Account;
    private wallet = inAppWallet();



    // constructor(chainDetails?: Details, tokenDetails?: TokenDetails) {
    // this.chainDetails = chainDetails || {} as Details;
    // this.tokenDetails = tokenDetails || {} as TokenDetails;
    constructor() {
        const client = createThirdwebClient({
            // The clientId will restrict usage from specific domain. Hence, ig we can comment it fn
            // clientId: process.env.THIRDWEB_CLIENT_ID!,
            secretKey: process.env.THIRDWEB_SECRET_KEY!
        });

        this.client = client;

        this.contract = getContract({
            client,
            address: process.env.CONTRACT_ADDRESS_MONAD!,
            chain: monadTestnet,
        });

        this.wallet.connect({
            client: client,
            strategy: "backend", // we use backend strategy to generate a wallet from a secret key
            walletSecret: process.env.THIRDWEB_WALLET_SECRET!, // use this secret to access the same wallet across multiple scripts
        }).then((val) => {
            this.account = val;
        });
    }

    contractDetails() {
        return this.contract.chain;
    }

    accountDetails() {
        return this.account;
    }
    async rewardContributor(address: string, amount: string): Promise<any> {
        const transaction = prepareContractCall({
            contract: this.contract,
            // Pass the method signature that you want to call
            method: "function transfer(address to, uint256 amount)",
            // and the params for that method
            // Their types are automatically inferred based on the method signature
            params: [address, toWei(amount)],
        });

        const result = await sendTransaction({
            transaction,
            account: this.account,
        });

        console.log("Transaction hash:", result.transactionHash);

        return { txHash: result.transactionHash}
    }
    async getAddressBalance(address?: string): Promise<string> {
        const balance = await balanceOf({
            contract: this.contract,
            address: address ?? this.account.address,
        });

        return toEther(balance).toString()
    }
}