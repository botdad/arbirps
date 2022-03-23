import ArbibotRPSAbi from '../abis/ArbibotRPS.json'
import ArbibotsAbi from '../abis/Arbibots.json'
import BotGoldAbi from '../abis/BotGold.json'

export const RPS_DEAD_MOVE = 3

export const ARBITRUM_CHAIN_ID = 42161

export const BOTGOLD_ADDRESS = '0x0165878a594ca255338adfa4d48449f69242eb8f'
export const BOTGOLD_DECIMALS = 18

export const ARBIBOT_ADDRESS = '0xc1fcf330b4b4c773fa7e6835f681e8f798e9ebff'
export const ARBIBOT_RPS_ADDRESS = '0xa513e6e4b8f2a923d98304ec87f64353c4d5c853'

export const ATTEST_ZKEY_PATH = '/snark/attestValidMove_0001.zkey'
export const ATTEST_WASM_PATH = '/snark/attestValidMove.wasm'

export const REVEAL_ZKEY_PATH = '/snark/revealMove_0001.zkey'
export const REVEAL_WASM_PATH = '/snark/revealMove.wasm'

export const BOTGOLD_CONFIG = { addressOrName: BOTGOLD_ADDRESS, contractInterface: BotGoldAbi }

export const ARBIBOT_RPS_CONFIG = { addressOrName: ARBIBOT_RPS_ADDRESS, contractInterface: ArbibotRPSAbi }

export const ARBIBOTS_ERC721_CONFIG = {
  addressOrName: ARBIBOT_ADDRESS,
  contractInterface: ArbibotsAbi,
}

export const EIP_2612_TYPES = {
  Permit: [
    { name: 'owner', type: 'address' },
    { name: 'spender', type: 'address' },
    { name: 'value', type: 'uint256' },
    { name: 'nonce', type: 'uint256' },
    { name: 'deadline', type: 'uint256' },
  ],
}

export const BOTGOLD_EIP_2612_DOMAIN = {
  name: 'BotGold',
  version: '1',
  chainId: ARBITRUM_CHAIN_ID,
  verifyingContract: BOTGOLD_ADDRESS,
}
