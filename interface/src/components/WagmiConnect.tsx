import { useEffect } from 'react'
import { useAccount, useConnect } from 'wagmi'

export const WagmiConnect = () => {
  const [{ data: connectData, error: connectError }, connect] = useConnect()
  const [{ data: accountData }, disconnect] = useAccount({
    fetchEns: true,
  })

  useEffect(() => {
    accountData?.connector?.getChainId().then((w) => console.log(w))
  }, [accountData])

  if (accountData) {
    return (
      <div>
        <div>{accountData.ens?.name ? `${accountData.ens?.name} (${accountData.address})` : accountData.address}</div>
        <div>Connected to {accountData.connector?.name}</div>
        <button onClick={disconnect}>Disconnect</button>
      </div>
    )
  }

  return (
    <div>
      {connectData.connectors.map((connector) => (
        <button disabled={!connector.ready} key={connector.id} onClick={() => connect(connector)}>
          {connector.name}
          {!connector.ready && ' (unsupported)'}
        </button>
      ))}

      {connectError && <div>{connectError?.message ?? 'Failed to connect'}</div>}
    </div>
  )
}
