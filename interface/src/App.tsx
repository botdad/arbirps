import React from 'react'
import { providers } from 'ethers'
import { WagmiProvider, chain, Connector } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { WalletLinkConnector } from 'wagmi/connectors/walletLink'

import './App.css'

import { WagmiConnect } from './components/WagmiConnect'
import { ConnectionInfo } from './components/ConnectionInfo'
import { ERC721Ownership } from './components/ERC721Ownership'
import { GenerateMove } from './components/GenerateMove'

// API key for Ethereum node
// Two popular services are Infura (infura.io) and Alchemy (alchemy.com)
const infuraId = process.env.INFURA_ID

// Chains for connectors to support
const chains = [chain.arbitrumOne, chain.arbitrumRinkeby, chain.localhost, chain.hardhat]

// Set up connectors
const connectors = ({ chainId }: { chainId?: Number }) => {
  const rpcUrl = chains.find((x) => x.id === chainId)?.rpcUrls?.[0] ?? chain.mainnet.rpcUrls[0]
  return [
    new InjectedConnector({
      chains,
      options: { shimDisconnect: true },
    }),
    new WalletConnectConnector({
      options: {
        infuraId,
        qrcode: true,
      },
    }),
    new WalletLinkConnector({
      options: {
        appName: 'Arbibot RPS',
        jsonRpcUrl: `${rpcUrl}/${infuraId}`,
      },
    }),
  ]
}

type GetProviderArgs = {
  chainId?: number
  connector?: Connector
}

const provider = ({ chainId, connector }: GetProviderArgs) => {
  console.log('getting provider', chainId)
  if (chainId === 31337) {
    const chain = connector?.chains.find((x) => x.id === 31337)?.rpcUrls[0]
    return new providers.JsonRpcProvider(chain)
  }
  return providers.getDefaultProvider(chainId)
}

function App() {
  return (
    <WagmiProvider autoConnect connectors={connectors} provider={provider}>
      <div className="App">
        <WagmiConnect></WagmiConnect>
        <ConnectionInfo></ConnectionInfo>
        <ERC721Ownership></ERC721Ownership>
        <GenerateMove></GenerateMove>
      </div>
    </WagmiProvider>
  )
}

export default App
