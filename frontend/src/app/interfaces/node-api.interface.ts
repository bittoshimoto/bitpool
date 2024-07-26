import { Block, Transaction } from "./electrs.interface";

export interface OptimizedMempoolStats {
  added: number;
  count: number;
  vbytes_per_second: number;
  total_fee: number;
  mempool_byte_weight: number;
  vsizes: number[];
}

interface Ancestor {
  txid: string;
  weight: number;
  fee: number;
}

interface BestDescendant {
  txid: string;
  weight: number;
  fee: number;
}

export interface CpfpInfo {
  ancestors: Ancestor[];
  descendants?: Ancestor[];
  bestDescendant?: BestDescendant | null;
  effectiveFeePerVsize?: number;
  sigops?: number;
  adjustedVsize?: number;
  acceleration?: boolean;
  acceleratedBy?: number[];
  acceleratedAt?: number;
  feeDelta?: number;
}

export interface RbfInfo {
  tx: RbfTransaction;
  time: number;
  interval?: number;
}

export interface RbfTree extends RbfInfo {
  mined?: boolean;
  fullRbf: boolean;
  replaces: RbfTree[];
  replacedBy?: RbfTransaction;
}

export interface DifficultyAdjustment {
  progressPercent: number;
  difficultyChange: number;
  estimatedRetargetDate: number;
  remainingBlocks: number;
  remainingTime: number;
  previousRetarget: number;
  previousTime: number;
  nextRetargetHeight: number;
  timeAvg: number;
  adjustedTimeAvg: number;
  timeOffset: number;
  expectedBlocks: number;
}

export interface AddressInformation {
  isvalid: boolean;                //  (boolean) If the address is valid or not. If not, this is the only property returned.
  isvalid_parent?: boolean;        //  (boolean) Elements only
  address: string;                 //  (string) The bitcoin address validated
  scriptPubKey: string;            //  (string) The hex-encoded scriptPubKey generated by the address
  isscript: boolean;               //  (boolean) If the key is a script
  iswitness: boolean;              //  (boolean) If the address is a witness
  witness_version?: number;        //  (numeric, optional) The version number of the witness program
  witness_program: string;         //  (string, optional) The hex value of the witness program
  confidential_key?: string;       //  (string) Elements only
  unconfidential?: string;         //  (string) Elements only
}

export interface LiquidPegs {
  amount: string;
  date: string;
}

export interface CurrentPegs {
  amount: string;
  lastBlockUpdate: number;
  hash: string;
}

export interface PegsVolume {
  volume: string;
  number: number;
}

export interface FederationAddress { 
  bitcoinaddress: string;
  balance: string;
}

export interface FederationUtxo {
  txid: string;
  txindex: number;
  bitcoinaddress: string;
  amount: number;
  blocknumber: number;
  blocktime: number;
  pegtxid: string;
  pegindex: number;
  pegblocktime: number;
  timelock: number;
  expiredAt: number;
  isDust?: boolean;
}

export interface RecentPeg {
  txid: string;
  txindex: number;
  amount: number;
  bitcoinaddress: string;
  bitcointxid: string;
  bitcoinindex: number;
  blocktime: number;
}

export interface AuditStatus {
  bitcoinBlocks: number;
  bitcoinHeaders: number;
  lastBlockAudit: number;
  isAuditSynced: boolean;
}

export interface ITranslators { [language: string]: string; }

/**
 * PoolRanking component
 */
export interface SinglePoolStats {
  poolId: number;
  poolUniqueId: number; // unique global pool id
  name: string;
  link: string;
  blockCount: number;
  emptyBlocks: number;
  rank: number;
  share: number;
  lastEstimatedHashrate: number;
  emptyBlockRatio: string;
  logo: string;
  slug: string;
  avgMatchRate: number;
  avgFeeDelta: number;
}
export interface PoolsStats {
  blockCount: number;
  lastEstimatedHashrate: number;
  pools: SinglePoolStats[];
}

/**
 * Pool component
 */
export interface PoolInfo {
  id: number | null; // mysql row id
  name: string;
  link: string;
  regexes: string; // JSON array
  addresses: string; // JSON array
  emptyBlocks: number;
  slug: string;
  poolUniqueId: number;
  unique_id: number;
}
export interface PoolStat {
  pool: PoolInfo;
  blockCount: {
    all: number,
    '24h': number,
    '1w': number,
  };
  blockShare: {
    all: number,
    '24h': number,
    '1w': number,
  };
  estimatedHashrate: number;
  avgBlockHealth: number;
  totalReward: number;
}

export interface BlockExtension {
  totalFees?: number;
  medianFee?: number;
  minFee?: number;
  maxFee?: number;
  feeRange?: number[];
  reward?: number;
  coinbaseRaw?: string;
  matchRate?: number;
  expectedFees?: number;
  expectedWeight?: number;
  feeDelta?: number;
  similarity?: number;
  pool?: {
    id: number;
    name: string;
    slug: string;
  }
}

export interface BlockExtended extends Block {
  extras?: BlockExtension;
}

export interface BlockAudit extends BlockExtended {
  missingTxs: string[],
  addedTxs: string[],
  prioritizedTxs: string[],
  freshTxs: string[],
  sigopTxs: string[],
  fullrbfTxs: string[],
  acceleratedTxs: string[],
  matchRate: number,
  expectedFees: number,
  expectedWeight: number,
  feeDelta?: number,
  weightDelta?: number,
  txDelta?: number,
  template: TransactionStripped[],
  transactions: TransactionStripped[],
}

export interface TransactionStripped {
  txid: string;
  fee: number;
  vsize: number;
  value: number;
  rate?: number; // effective fee rate
  acc?: boolean;
  flags?: number | null;
  time?: number;
  status?: 'found' | 'missing' | 'sigop' | 'fresh' | 'freshcpfp' | 'added' | 'prioritized' | 'censored' | 'selected' | 'rbf' | 'accelerated';
  context?: 'projected' | 'actual';
}

export interface RbfTransaction extends TransactionStripped {
  rbf?: boolean;
  mined?: boolean,
  fullRbf?: boolean,
}
export interface MempoolPosition {
  block: number,
  vsize: number,
  accelerated?: boolean,
  acceleratedBy?: number[],
}

export interface AccelerationPosition extends MempoolPosition {
  poolId: number;
  offset?: number;
}

export interface RewardStats {
  startBlock: number;
  endBlock: number;
  totalReward: number;
  totalFee: number;
  totalTx: number;
}

export interface BlockSizesAndWeights {
  sizes: {
    timestamp: number;
    avgHeight: number;
    avgSize: number;
  }[];
  weights: {
    timestamp: number;
    avgHeight: number;
    avgWeight: number;
  }[];
}

export interface AuditScore {
  hash: string;
  matchRate?: number;
}

export interface ITopNodesPerChannels {
  publicKey: string,
  alias: string,
  channels?: number,
  capacity: number,
  firstSeen?: number,
  updatedAt?: number,
  city?: any,
  country?: any,
  subdivision?: any,
  iso_code?: string,
  geolocation?: any;
}

export interface ITopNodesPerCapacity {
  publicKey: string,
  alias: string,
  capacity: number,
  channels?: number,
  firstSeen?: number,
  updatedAt?: number,
  city?: any,
  country?: any,
  subdivision?: any,
  iso_code?: string,
  geolocation?: any;
}

export interface INodesRanking {
  topByCapacity: ITopNodesPerCapacity[];
  topByChannels: ITopNodesPerChannels[];
}

export interface INodesStatisticsEntry {
  added: string;
  avg_base_fee_mtokens: number; 
  avg_capacity: number;
  avg_fee_rate: number;
  channel_count: number;
  clearnet_nodes: number;
  clearnet_tor_nodes: number;
  id: number; 
  med_base_fee_mtokens: number;
  med_capacity: number;
  med_fee_rate: number;
  node_count: number;
  tor_nodes: number;
  total_capacity: number;
  unannounced_nodes: number;
}

export interface INodesStatistics {
  latest: INodesStatisticsEntry;
  previous: INodesStatisticsEntry;
}

export interface IOldestNodes {
  publicKey: string,
  alias: string,
  firstSeen: number,
  channels?: number,
  capacity: number,
  updatedAt?: number,
  city?: any,
  country?: any,
  subdivision?: any,
  iso_code?: string,
  geolocation?: any;
}

export interface IChannel {
  id: number;
  short_id: string;
  capacity: number;
  transaction_id: string;
  transaction_vout: number;
  closing_transaction_id: string;
  closing_reason: string;
  updated_at: string;
  closing_date?: string;
  created: string;
  status: number;
  node_left: INode,
  node_right: INode,
}


export interface INode {
  alias: string;
  public_key: string;
  channels: number;
  capacity: number;
  base_fee_mtokens: number;
  cltv_delta: number;
  fee_rate: number;
  is_disabled: boolean;
  max_htlc_mtokens: number;
  min_htlc_mtokens: number;
  updated_at: string;
  longitude: number;
  latitude: number;
  funding_balance?: number;
  closing_balance?: number;
}

export interface Acceleration {
  txid: string;
  status: 'requested' | 'accelerating' | 'completed_provisional' | 'completed' | 'failed' | 'failed_provisional';
  pools: number[];
  feePaid: number;
  added: number; // timestamp
  lastUpdated: number; // timestamp
  baseFee: number;
  vsizeFee: number;
  effectiveFee: number;
  effectiveVsize: number;
  feeDelta: number;
  blockHash: string;
  blockHeight: number;

  acceleratedFeeRate?: number;
  boost?: number;
  bidBoost?: number;
  boostCost?: number;
  boostRate?: number;
  minedByPoolUniqueId?: number;
}

export interface AccelerationHistoryParams {
  status?: string; // Single status or comma separated list of status
  timeframe?: string;
  poolUniqueId?: number;
  blockHash?: string;
  blockHeight?: number;
  page?: number;
  pageLength?: number;
}

export interface AccelerationInfo {
  txid: string,
  height: number,
  pool: {
    id: number,
    slug: string,
    name: string,
  },
  effective_vsize: number,
  effective_fee: number,
  boost_rate: number,
  boost_cost: number,
}

export interface TestMempoolAcceptResult {
  txid: string,
  wtxid: string,
  allowed?: boolean,
  vsize?: number,
  fees?: {
    base: number,
    "effective-feerate": number,
    "effective-includes": string[],
  },
  ['reject-reason']?: string,
}