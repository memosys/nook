export type FidHash = {
  fid: string;
  hash: string;
};

export type FarcasterCastAddData = {
  timestamp: number;
  fid: string;
  hash: string;
  text: string;
  parentFid?: string;
  parentHash?: string;
  parentUrl?: string;
  rootParentFid: string;
  rootParentHash: string;
  rootParentUrl?: string;
  mentions: {
    mention: string;
    mentionPosition: string;
  }[];
  urls: { url: string }[];
  casts: {
    fid: string;
    hash: string;
  }[];
};

export enum FarcasterReactionType {
  NONE = "none",
  LIKE = "like",
  RECAST = "recast",
}

export type FarcasterCastReactionData = {
  timestamp: number;
  fid: string;
  reactionType: FarcasterReactionType;
  targetFid: string;
  targetHash: string;
};

export type FarcasterUrlReactionData = {
  timestamp: number;
  fid: string;
  reactionType: FarcasterReactionType;
  url: string;
};
