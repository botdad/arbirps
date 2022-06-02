import { providers } from 'ethers'
import { WagmiProvider, chain, Connector } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { WalletLinkConnector } from 'wagmi/connectors/walletLink'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { BaseProvider } from '@ethersproject/providers'

import './App.scss'

import { StartRound } from './pages/StartRound'
import { ConnectedWrapper } from './components/ConnectedWrapper'
import { OwnedBotsProvider } from './contexts/OwnedBots'
import { RoundsProvider } from './contexts/Rounds'
import { GlobalErrorProvider } from './contexts/GlobalError'
import { ErrorModal } from './components/ErrorModal'
import { Nav } from './components/Nav'
import { OpenRounds } from './pages/OpenRounds'
import { RoundFight } from './pages/RoundFight'
import { Rounds } from './pages/Rounds'
import { RoundCountsProvider } from './contexts/RoundCounts'
import { RoundDetails } from './pages/RoundDetails'

// API key for Ethereum node
// Two popular services are Infura (infura.io) and Alchemy (alchemy.com)
const infuraId = process.env.INFURA_ID

// Chains for connectors to support
// const chains = [chain.arbitrumOne, chain.arbitrumRinkeby, chain.localhost, chain.hardhat]
const chains = [chain.arbitrumRinkeby]

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

const provider = ({ chainId, connector }: GetProviderArgs): BaseProvider => {
  console.log('getting provider', chainId)
  if (chainId === 421611) {
    const chain = connector?.chains.find((x) => x.id === 421611)?.rpcUrls[0]
    return new providers.JsonRpcProvider(chain) as any as BaseProvider
  }
  return providers.getDefaultProvider(chainId) as any as BaseProvider
}

function App() {
  return (
    <WagmiProvider autoConnect connectors={connectors} provider={provider}>
      <GlobalErrorProvider>
        <RoundCountsProvider>
          <Router>
            <Nav></Nav>
            <ConnectedWrapper>
              <OwnedBotsProvider>
                <RoundsProvider>
                  <Routes>
                    <Route path="/start-round" element={<StartRound />} />
                    <Route path="/rounds" element={<Rounds />} />
                    <Route path="/rounds/:roundId" element={<RoundDetails />} />
                    <Route path="/rounds/:roundId/fight" element={<RoundFight />} />
                    <Route path="/open-rounds" element={<OpenRounds />} />
                  </Routes>
                </RoundsProvider>
              </OwnedBotsProvider>
            </ConnectedWrapper>
            <ErrorModal></ErrorModal>
          </Router>
        </RoundCountsProvider>
      </GlobalErrorProvider>
    </WagmiProvider>
  )
}

export default App
