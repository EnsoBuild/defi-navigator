export type RoutingStrategy = 'router' | 'delegate' | 'ensowallet';

export type RouteParams = {
  fromAddress: Address;
  receiver: Address;
  spender: Address;
  chainId: number;
  amountIn: string;
  slippage?: number; // Slippage in basis points (1/10000). If specified, minAmountOut should not be specified
  minAmountOut?: string;
  tokenIn: Address;
  tokenOut: Address;
  routingStrategy?: RoutingStrategy;
  fee?: number; // Fee in basis points (1/10000) for each amountIn value. Must be in range 0-100. If specified, this percentage of each amountIn value will be sent to feeReceiver
  feeReceiver?: Address;
};

export type RouteSegment = {
  action: string;
  protocol: string;
  primary?: Address;
  tokenIn: Address[];
  tokenOut: Address[];
  positionInId?: string[];
  positionOutId?: string[];
  internalRoutes?: RouteSegment[][];
};

export type RouteData = {
  route: RouteSegment[];
  gas: number; // Estimated gas used by the transaction. Increase by 50% as a buffer.
  amountOut: number; // Estimated amount received.
  priceImpact: number | null; // Price impact in basis points, null if USD price not found.
  createdAt: number; // Block number the transaction was created on.
  tx: {
    data: string;
    to: Address;
    from: Address;
    value: string;
  };
  feeAmount: {
    [key: string]: number; // Collected fee amounts for each amountIn input.
  }[];
};

export type ApproveParams = {
  fromAddress: Address;
  tokenAddress: Address;
  chainId: number;
  amount: string;
  routingStrategy?: RoutingStrategy;
};

export type ApproveData = {
  amount: string;
  gas: string;
  spender: Address;
  token: Address;
  tx: {
    data: string;
    from: Address;
    to: Address;
  };
};

export type QuoteParams = Omit<RouteParams, 'spender' | 'receiver' | 'slippage'>;

export type QuoteData = {
  amountOut: string;
  gas: string;
  priceImpact: number;
};

export type BalanceParams = {
  chainId: number;
  eoaAddress: Address;
  useEoa?: boolean;
};

export type BalanceData = {
  amount: string;
  decimals: number;
  token: Address;
  price: string;
};

export type PriceParams = {
  chainId: number;
  address: Address;
};

export type PriceData = {
  price: string; // 3614.8
  decimals: number; // 18
  symbol: string;
  timestamp: number;
  confidence: number; // 0.99 means 99% confidence
};

export type ProtocolParams = {
  chainId: number;
  slug?: string;
};

export type ProtocolData = Protocol;

type AmountInArgument =
  | string
  | {
      useOutputOfCallAt: number;
      index?: number;
    };

export type BundleParams = {
  chainId: number;
  fromAddress: Address;
  routingStrategy?: RoutingStrategy;
  receiver?: Address;
  spender?: Address;
};

export enum BundleActionType {
  Swap = 'swap',
  Transfer = 'transfer',
  Bridge = 'bridge',
  Deposit = 'deposit',
  DepositCLMM = 'depositclmm',
  Redeem = 'redeem',
  RedeemCLMM = 'redeemclmm',
  Route = 'route',
  Balance = 'balance'
}

export type DepositAction = {
  action: BundleActionType.Deposit;
  args: {
    amountIn: AmountInArgument;
    tokenIn: Address;
    tokenOut: Address;
    primaryAddress: Address;
  };
};

export type DepositCLMMAction = {
  action: BundleActionType.DepositCLMM;
  args: {
    amountIn: [AmountInArgument, AmountInArgument];
    tokenIn: [Address, Address];
    tokenOut: Address;
    tickLower: string;
    tickUpper: string;
  };
};

export type RouteAction = {
  protocol: 'enso';
  action: BundleActionType.Route;
  args: {
    slippage?: string;
    amountIn: AmountInArgument;
    tokenIn: Address;
    tokenOut: Address;
  };
};

export type BridgeAction = {
  action: BundleActionType.Bridge;
  args: {
    receiver: Address;
    primaryAddress: Address;
    amountIn: AmountInArgument;
    tokenIn: Address;
    destinationChainId: number;
    callback: any[];
  };
};

export type BalanceAction = {
  protocol: 'enso';
  action: BundleActionType.Balance;
  args: {
    tokenIn: Address;
  };
};

export type TransferAction = {
  protocol: 'enso';
  action: BundleActionType.Transfer;
  args: {
    tokenIn: Address;
    amountIn: AmountInArgument;
    receiver?: Address;
  };
};

export type RedeemAction = {
  protocol: 'enso';
  action: BundleActionType.Redeem;
  args: {
    tokenIn: Address;
    tokenOut: Address;
    amountIn: AmountInArgument;
    receiver?: Address;
    primaryAddress: Address;
  };
};

export type BundleAction = {
  protocol: string;
} & (
  | DepositAction
  | DepositCLMMAction
  | RouteAction
  | BridgeAction
  | BalanceAction
  | TransferAction
  | RedeemAction
);

export type BundleData = {
  bundle: BundleAction[];
  gas: string;
  createdAt: number;
  amountsOut: {
    [address: Address]: string;
  };
  tx: {
    data: string;
    to: Address;
    from: Address;
    value: string;
  };
};

/**
 * TokenParameters interface for DeFi token filtering
 */
export interface TokenParams {
  /** The overarching project or platform associated with the DeFi token */
  project?: string;

  /** The specific standard integration or version of the DeFi project */
  protocolSlug?: string;

  /** Underlying tokens of defi token */
  underlyingTokens?: MultiAddress;

  /** Exact composition of underlying tokens of defi token */
  underlyingTokensExact?: MultiAddress;

  /** Ethereum addresses for contract interaction of defi tokens */
  primaryAddress?: string[];

  /** Ethereum addresses of the tokens */
  address?: MultiAddress;

  /** Chain ID of the network of the token */
  chainId?: number;

  /** Type of token. If not provided, both types will be taken into account */
  type?: 'defi' | 'base';

  /** Pagination page number. Pages are of length 1000 */
  page?: number;

  /** Cursor for pagination. Pages are of length 1000 */
  cursor?: number;

  /** Whether to include token metadata (symbol, name and logos) */
  includeMetadata?: boolean;

  /** Only include tokens with APY over this value */
  apyFrom?: number;

  /** Only include tokens with APY below this value */
  apyTo?: number;

  /** Only include tokens with TVL over this value */
  tvlFrom?: number;

  /** Only include tokens with TVL below this value */
  tvlTo?: number;
}

export interface ProjectData {
  id: string;
}

// Base Types
export type Address = `0x${string}`;
export type MultiAddress = Address | Address[];

// Network related types
export interface Network {
  id: number;
  name: string;
  isConnected?: boolean;
}

// Protocol related types
export interface Protocol {
  slug: string;
  name?: string;
  description?: string;
  url?: string;
  logosUri?: string[];
  chains?: Network[];
  project?: string;
}

// Token related types
export interface UnderlyingToken {
  address: string;
  chainId: number;
  type: string;
  decimals: number;
  symbol?: string;
  name?: string;
  logosUri?: string[];
}

export interface Token {
  address: Address;
  chainId: number;
  type: string;
  decimals: number;
  symbol?: string;
  name?: string;
  logosUri?: string[];
  underlyingTokens?: UnderlyingToken[];
  project?: string;
  protocolSlug?: string;
  apy?: number | null;
  apyBase?: number | null;
  apyReward?: number | null;
  tvl?: number | null;
  primaryAddress?: string;
}

export interface TokenData extends Token {
  project: string;
  protocolSlug: string;
  underlyingTokens: Token[];
  primaryAddress: Address;
  apy: number | null;
  tvl: number | null;
}

export interface PaginationMeta {
  total: number;
  lastPage: number;
  currentPage: number;
  perPage: number;
  prev: number | null;
  next: number | null;
  cursor: number | null;
}

export interface TokensResponse {
  data: Token[];
  meta: PaginationMeta;
}
