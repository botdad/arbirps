import React, { createContext, PropsWithChildren } from 'react'
import { BigNumber } from 'ethers'
import { useEffect, useState } from 'react'
import { useAccount, useContractRead } from 'wagmi'
import { ARBIBOTS_ERC721_CONFIG } from '../util/constants'

const defaultValue: number[] = []
const OwnedBots = createContext(defaultValue)

export const OwnedBotsProvider = (props: PropsWithChildren<any>) => {
  const [{ data: accountData }] = useAccount()
  const [address, setAddress] = useState('')
  const [tokenIds, setTokenIds] = useState<number[]>([])
  const [, tokenOfOwnerByIndex] = useContractRead(ARBIBOTS_ERC721_CONFIG, 'tokenOfOwnerByIndex', { skip: true })

  const [{ data: balanceData, error: balanceError, loading: balanceLoading }, balanceOf] = useContractRead(
    ARBIBOTS_ERC721_CONFIG,
    'balanceOf',
    { skip: true }
  )

  useEffect(() => {
    if (accountData && address !== accountData.address) {
      setAddress(accountData.address)
    }
  }, [accountData, address])

  useEffect(() => {
    if (address !== '') {
      balanceOf({ args: [address] })
    }
  }, [address, balanceOf])

  useEffect(() => {
    const fetchTokenIds = async () => {
      if (balanceData) {
        const balance = (balanceData as any as BigNumber).toNumber()
        const promises: Promise<any>[] = []
        for (let i = 0; i < balance; i++) {
          promises.push(tokenOfOwnerByIndex({ args: [address, i] }))
        }

        const rawTokenIds = await Promise.all(promises)
        const tokenIds = rawTokenIds.map((t) => (t.data as any as BigNumber).toNumber())
        setTokenIds(tokenIds)
      }
    }

    fetchTokenIds()
  }, [address, balanceData, tokenOfOwnerByIndex])

  return <OwnedBots.Provider {...props} value={tokenIds} />
}

export default OwnedBots
