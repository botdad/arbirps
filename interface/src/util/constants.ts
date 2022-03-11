import ArbibotRPSAbi from '../abis/ArbibotRPS.json'

export const ARBIBOT_ADDRESS = '0x5fbdb2315678afecb367f032d93f642f64180aa3'
export const ARBIBOT_RPS_ADDRESS = '0xe7f1725e7734ce288f8367e1bb143e90bb3f0512'

export const ATTEST_ZKEY_PATH = '/snark/attestValidMove_0001.zkey'
export const ATTEST_WASM_PATH = '/snark/attestValidMove.wasm'

export const REVEAL_ZKEY_PATH = '/snark/revealMove_0001.zkey'
export const REVEAL_WASM_PATH = '/snark/revealMove.wasm'

export const ARBIBOT_RPS_CONFIG = { addressOrName: ARBIBOT_RPS_ADDRESS, contractInterface: ArbibotRPSAbi }
