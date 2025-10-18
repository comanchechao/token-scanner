declare module "@solana-mobile/wallet-standard-mobile" {
  export function registerMwa(config: any): void;
  export function createDefaultAuthorizationCache(): any;
  export function createDefaultChainSelector(): any;
  export function createDefaultWalletNotFoundHandler(): () => void;
}
