import React, { useState } from 'react'
import { providers } from 'ethers'
import { WagmiProvider, chain, Connector } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { WalletLinkConnector } from 'wagmi/connectors/walletLink'
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import styled from 'styled-components'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'

import './App.scss'

import { StartRound } from './pages/StartRound'
import { ConnectedWrapper } from './components/ConnectedWrapper'
import { OpenRounds } from './components/OpenRounds'
import { SubmitMove2 } from './components/SubmitMove2'
import { EndRound } from './components/EndRound'
import { RevealMoveProof } from './util/proofs'
import { OwnedBotSelector } from './components/OwnedBotSelector'
import { OwnedBotsProvider } from './contexts/OwnedBots'
import { ArbibotRPSRound, RoundsProvider } from './contexts/Rounds'
import { EndableRounds } from './components/EndableRounds'
import { GlobalErrorProvider } from './contexts/GlobalError'
import { ErrorModal } from './components/ErrorModal'
import { Nav } from './components/Nav'

const CloudBox = styled.div``

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
  /*

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
                   */

  return (
    <WagmiProvider autoConnect connectors={connectors} provider={provider}>
      <GlobalErrorProvider>
        <Router>
          <Nav></Nav>
          <ConnectedWrapper>
            <OwnedBotsProvider>
              <RoundsProvider>
                <Routes>
                  <Route path="/start-round" element={<StartRound />} />
                </Routes>
              </RoundsProvider>
            </OwnedBotsProvider>
          </ConnectedWrapper>
          <ErrorModal></ErrorModal>
        </Router>
      </GlobalErrorProvider>
    </WagmiProvider>
  )
}

export default App
