import { PropsWithChildren } from 'react'
import { useNetwork } from 'wagmi'

export const ConnectedWrapper = ({ children }: PropsWithChildren<any>) => {
  const [{ data, error, loading }] = useNetwork()

  if (data.chain && !error && !loading) {
    return <>{children}</>
  }
  return <></>
}
