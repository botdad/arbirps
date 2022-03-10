import { useNetwork } from 'wagmi'

export const ConnectionInfo = () => {
  const [{ data: networkData, error, loading }, switchNetwork] = useNetwork()

  return (
    <>
      <div>
        {networkData.chain?.name ?? networkData.chain?.id} {networkData.chain?.unsupported && '(unsupported)'}
      </div>

      {switchNetwork &&
        networkData.chains.map((x) =>
          x.id === networkData.chain?.id ? null : (
            <button key={x.id} onClick={() => switchNetwork(x.id)}>
              Switch to {x.name}
            </button>
          )
        )}

      {error && <div>{error?.message}</div>}
    </>
  )
}
