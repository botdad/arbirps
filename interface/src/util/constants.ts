import ArbibotRPSAbi from '../abis/ArbibotRPS.json'
import ArbibotsAbi from '../abis/Arbibots.json'

export const RPS_DEAD_MOVE = 3

export const ARBIBOT_ADDRESS = '0xc1fcf330b4b4c773fa7e6835f681e8f798e9ebff'
export const ARBIBOT_RPS_ADDRESS = '0x0165878a594ca255338adfa4d48449f69242eb8f'

export const ATTEST_ZKEY_PATH = '/snark/attestValidMove_0001.zkey'
export const ATTEST_WASM_PATH = '/snark/attestValidMove.wasm'

export const REVEAL_ZKEY_PATH = '/snark/revealMove_0001.zkey'
export const REVEAL_WASM_PATH = '/snark/revealMove.wasm'

export const ARBIBOT_RPS_CONFIG = { addressOrName: ARBIBOT_RPS_ADDRESS, contractInterface: ArbibotRPSAbi }

export const ARBIBOTS_ERC721_CONFIG = {
  addressOrName: ARBIBOT_ADDRESS,
  contractInterface: ArbibotsAbi,
}
