export type ContentActionData = {
  /** Entity acting */
  entityId: string;

  /** Content being acted on */
  contentId: string;
};

export type EntityActionData = {
  /** Entity acting */
  entityId: string;

  /** Entity who was acted on */
  targetEntityId: string;

  /** Source entity acting */
  sourceUserId: string;

  /** Source entity who was acted on */
  sourceTargetUserId: string;
};

export enum Protocol {
  ETHEREUM = "ETHEREUM",
  SOLANA = "SOLANA",
}

export enum EntityInfoType {
  /** PFP - Profile Picture for the user */
  PFP = "PFP",
  /** DISPLAY - Display Name for the user */
  DISPLAY = "DISPLAY",
  /** BIO - Bio for the user */
  BIO = "BIO",
  /** URL - URL of the user */
  URL = "URL",
  /** USERNAME - Preferred Name for the user */
  USERNAME = "USERNAME",
}

export type UpdateEntityInfoActionData = {
  /** Identity of user acting */
  entityId: string;

  /** Source entity acting */
  sourceEntityId: string;

  /** The type of data added or updated by the user */
  entityDataType: EntityInfoType;

  /** User data */
  entityData: string;
};

export enum UsernameType {
  FNAME = "fname",
  ENS = "ens",
}

export type EntityUsernameData = {
  /** Identity of user acting */
  entityId: string;

  /** Source entity acting */
  sourceEntityId: string;

  /** Username */
  username: string;

  /** Owner of the username */
  owner: string;

  /** Type of username */
  usernameType: UsernameType;
};

export type LinkBlockchainAddressActionData = {
  /** Identity of user acting */
  entityId: string;

  /** Source entity acting */
  sourceEntityId: string;

  /** Address verified */
  address: string;

  /** If the address is a contract */
  isContract: boolean;

  /** The protocol being linked */
  protocol: Protocol;

  /** The chainId (if contract) */
  chainId: number;

  /** The chain being linked */
  claimSignature: string;

  /** Block hash of claimSignature */
  blockHash: string;
};

export type TipActionData = {
  /** Identity of user tipping */
  entityId: string;

  /** Identity of user receiving the tip */
  targetEntityId: string;

  /** CAIP-19 identifier of the asset being tipped */
  contentId: string;

  /** Amount being tipped */
  amount: number;

  /** Content ID being tipped from */
  sourceContentId: string;

  /** Content ID being tipped for */
  targetContentId: string;
};
