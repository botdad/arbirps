import { ReactNode } from 'react'
import { useNetwork } from 'wagmi'

export const ConnectedWrapper = ({ children }: { children: ReactNode }) => {
  const [{ data, error, loading }] = useNetwork()

  if (data.chain && !error && !loading) {
    return <>{children}</>
  }
  return <></>
}
