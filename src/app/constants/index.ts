export const VAULT_INFO_ADDRESS = "0x68C61AF097b834c68eA6EA5e46aF6c04E8945B2d";
export const VAULT_INFO_ABI = [
  {
    inputs: [{ name: "_cdpId", type: "uint256" }],
    name: "getCdpInfo",
    outputs: [
      { name: "urn", type: "address" },
      { name: "owner", type: "address" },
      { name: "userAddr", type: "address" },
      { name: "ilk", type: "bytes32" },
      { name: "collateral", type: "uint256" },
      { name: "debt", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
];

export const VAT_ADDRESS = "0x35D1b3F3D7966A1DFe207aa4514C12a259A0492B";
export const VAT_ABI = [
  {
    inputs: [{ name: "", type: "bytes32" }],
    name: "ilks",
    outputs: [
      { name: "Art", type: "uint256" },
      { name: "rate", type: "uint256" },
      { name: "spot", type: "uint256" },
      { name: "line", type: "uint256" },
      { name: "dust", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
];

export const collateralTypes = [
  {
    name: "ETH",
    value: "eth",
  },
  {
    name: "WBTC",
    value: "wbtc",
  },
  {
    name: "USDC",
    value: "usdc",
  },
];
