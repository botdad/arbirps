import React, { useState } from 'react'
import { providers } from 'ethers'
import { WagmiProvider, chain, Connector } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { WalletLinkConnector } from 'wagmi/connectors/walletLink'

import './App.css'

import { WagmiConnect } from './components/WagmiConnect'
import { ConnectionInfo } from './components/ConnectionInfo'
import { ERC721Ownership } from './components/ERC721Ownership'
import { StartRound } from './components/StartRound'
import { ConnectedWrapper } from './components/ConnectedWrapper'
import { ArbibotRPSRound, CurrentRounds } from './components/CurrentRounds'
import { SubmitMove2 } from './components/SubmitMove2'
import { EndRound } from './components/EndRound'
import { RevealMoveProof } from './util/proofs'

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
  const [arbibotId, setArbibotId] = useState('')
  const [nonce, setNonce] = useState('')
  const [roundId, setRoundId] = useState('')
  const [moveAttestation, setMoveAttestation] = useState('')

  const onRevealGeneration = (proofData: RevealMoveProof) => {
    console.log(proofData)
  }

  const onRoundSelected = (round: ArbibotRPSRound) => {
    console.log(round)
    setArbibotId(round.arbibotId1.toString())
    setNonce(round.nonce.toString())
    setRoundId(round.roundId.toString())
    setMoveAttestation(round.move1Attestation.toHexString())
  }

  return (
    <WagmiProvider autoConnect connectors={connectors} provider={provider}>
      <div className="App">
        <div>
          <h1>Connection Info</h1>
          <WagmiConnect></WagmiConnect>
          <ConnectionInfo></ConnectionInfo>
        </div>
        <ConnectedWrapper>
          <div>
            <h1>Mock NFT controll</h1>
            <ERC721Ownership></ERC721Ownership>
          </div>
          <div>
            <h1>Player1: Start new RPS round</h1>
            <StartRound></StartRound>
          </div>
          <div>
            <h1>Player2: Submit move 2</h1>
            <SubmitMove2 roundId={roundId}></SubmitMove2>
          </div>
          <div>
            <h1>Player1: End Round</h1>
            <EndRound
              nonce={nonce}
              arbibotId={arbibotId}
              roundId={roundId}
              moveAttestation={moveAttestation}
              onGeneration={onRevealGeneration}
            ></EndRound>
          </div>
          <div>
            <h1>Current rounds</h1>
            <CurrentRounds onRoundSelected={onRoundSelected}></CurrentRounds>
          </div>
        </ConnectedWrapper>
      </div>
    </WagmiProvider>
  )
}

export default App
