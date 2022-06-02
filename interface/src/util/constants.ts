import ArbibotRPSAbi from '../abis/ArbibotRPS.json'
import ArbibotsAbi from '../abis/Arbibots.json'
import BotGoldAbi from '../abis/BotGold.json'

export const RPS_DEAD_MOVE = 3

export const ARBITRUM_CHAIN_ID = 421611

export const BOTGOLD_ADDRESS = '0x42fF54DBd843603dbb0885e5247E1b39FF51D40B'
export const BOTGOLD_DECIMALS = 18

export const ARBIBOT_ADDRESS = '0x74b88848d0f4ba7f96c989f42f97d76d187f1388'
export const ARBIBOT_RPS_ADDRESS = '0xf77aec3d8b2b05033b04a8a2c930184cbabeaab1'

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
