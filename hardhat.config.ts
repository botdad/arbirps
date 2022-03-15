import { config as dotEnvConfig } from 'dotenv'
dotEnvConfig()

import { HardhatUserConfig } from 'hardhat/types'

const config: HardhatUserConfig = {
  networks: {
    hardhat: {
      chainId: 42161,
      loggingEnabled: false,
      allowUnlimitedContractSize: false,
      forking: {
        url: `https://arbitrum-mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
      },
    },
  },
  solidity: {
    version: '0.8.10',
  },
}

export default config
