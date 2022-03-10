import { FormEvent, useState } from 'react'
import { useContractRead, useContractWrite } from 'wagmi'
import ArbibotRPSAbi from '../abis/ArbibotRPS.json'
import { ARBIBOT_RPS_ADDRESS } from '../util/constants'

const ARBIBOT_RPS_CONFIG = {
  addressOrName: ARBIBOT_RPS_ADDRESS,
  contractInterface: ArbibotRPSAbi,
}

export const ERC721Ownership = () => {
  const [newAddress, setNewAddress] = useState('')
  const [{ data: readData, error: readError, loading: readLoading }, read] = useContractRead(
    ARBIBOT_RPS_CONFIG,
    'owner',
    { skip: true }
  )

  const [{ error: writeError, loading: writeLoading }, write] = useContractWrite(ARBIBOT_RPS_CONFIG, 'setOwner', {
    args: [newAddress],
  })

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log(`writing ${newAddress}`)
    write()
  }

  return (
    <div>
      <button onClick={() => read()}>Get current owner</button>
      <div>{readLoading ? 'loading owner' : readData}</div>

      <form onSubmit={handleSubmit}>
        <label>
          New owner for mock erc721:
          <input type="text" value={newAddress} onChange={(e) => setNewAddress(e.target.value)} />
        </label>
        <input type="submit" value="Submit" />
      </form>

      {readError && <div>{readError?.message}</div>}
    </div>
  )
}
