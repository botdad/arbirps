import { createContext, PropsWithChildren, useState } from 'react'

type RoundCountContext = {
  endable: number
  playable: number
  setEndable: (count: number) => void
  setPlayable: (count: number) => void
}
const defaultValue: RoundCountContext = {
  endable: 0,
  playable: 0,
  setEndable: (count: number) => {},
  setPlayable: (count: number) => {},
}
const RoundCount = createContext(defaultValue)

export const RoundCountsProvider = (props: PropsWithChildren<any>) => {
  const [endable, setEndable] = useState(0)
  const [playable, setPlayable] = useState(0)

  const contextValue: RoundCountContext = {
    endable,
    playable,
    setEndable,
    setPlayable,
  }

  return <RoundCount.Provider {...props} value={contextValue} />
}

export default RoundCount
