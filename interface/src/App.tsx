import React, { useState } from 'react'
import { providers } from 'ethers'
import { WagmiProvider, chain, Connector } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { WalletLinkConnector } from 'wagmi/connectors/walletLink'

import './App.css'

import { WagmiConnect } from './components/WagmiConnect'
import { ConnectionInfo } from './components/ConnectionInfo'
import { StartRound } from './components/StartRound'
import { ConnectedWrapper } from './components/ConnectedWrapper'
import { OpenRounds } from './components/OpenRounds'
import { SubmitMove2 } from './components/SubmitMove2'
import { EndRound } from './components/EndRound'
import { RevealMoveProof } from './util/proofs'
import { BotSelector } from './components/BotSelector'
import { OwnedBotSelector } from './components/OwnedBotSelector'
import { OwnedBotsProvider } from './contexts/OwnedBots'
import { ArbibotRPSRound, RoundsProvider } from './contexts/Rounds'
import { EndableRounds } from './components/EndableRounds'

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
  if (chainId === 42161) {
    const chain = connector?.chains.find((x) => x.id === 31337)?.rpcUrls[0]
    return new providers.JsonRpcProvider(chain)
  }
  return providers.getDefaultProvider(chainId)
}

function App() {
  const [tab, setTab] = useState(0)
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
        <hr />
        <ConnectedWrapper>
          <OwnedBotsProvider>
            <RoundsProvider>
              <button onClick={() => setTab(0)} disabled={tab === 0}>
                New round
              </button>
              <button onClick={() => setTab(1)} disabled={tab === 1}>
                Open rounds
              </button>
              <button onClick={() => setTab(2)} disabled={tab === 2}>
                Rounds to end
              </button>
              {tab === 0 && (
                <div>
                  <h1>Player1: Start new RPS round</h1>
                  <p>Choose your bot:</p>
                  <OwnedBotSelector onBotSelected={(id) => setArbibotId(`${id}`)}></OwnedBotSelector>
                  <p>Choose your throw:</p>
                  <StartRound arbibotId={arbibotId}></StartRound>
                </div>
              )}
              {tab === 1 && (
                <div>
                  <h1>Player2: Submit move 2</h1>
                  <p>Choose opponent:</p>
                  <OpenRounds onRoundSelected={onRoundSelected}></OpenRounds>
                  <p>Choose your bot:</p>
                  <OwnedBotSelector onBotSelected={(id) => setArbibotId(`${id}`)}></OwnedBotSelector>
                  <p>Choose your throw:</p>
                  <SubmitMove2 roundId={roundId} arbibotId={arbibotId}></SubmitMove2>
                </div>
              )}
              {tab === 2 && (
                <div>
                  <h1>Player1: End Round</h1>
                  <EndableRounds onRoundSelected={onRoundSelected}></EndableRounds>
                  <EndRound
                    nonce={nonce}
                    arbibotId={arbibotId}
                    roundId={roundId}
                    moveAttestation={moveAttestation}
                    onGeneration={onRevealGeneration}
                  ></EndRound>
                </div>
              )}
            </RoundsProvider>
          </OwnedBotsProvider>
        </ConnectedWrapper>
      </div>
    </WagmiProvider>
  )
}

export default App
