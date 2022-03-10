import { FormEvent, useState } from 'react'
import { useContractRead, useContractWrite } from 'wagmi'
import ERC721Abi from '../abis/MockMinimalErc721.json'
import { MockMinimalErc721 } from '../abis/types'
import { ARBIBOT_ADDRESS } from '../util/constants'

const DEFAULT_MOCK_ERC721_CONFIG = {
  addressOrName: ARBIBOT_ADDRESS,
  contractInterface: ERC721Abi,
}

export const ERC721Ownership = () => {
  const [newAddress, setNewAddress] = useState('')
  const [{ data: readData, error: readError, loading: readLoading }, read] = useContractRead(
    DEFAULT_MOCK_ERC721_CONFIG,
    'owner',
    { skip: true }
  )

  const [{ error: writeError, loading: writeLoading }, write] = useContractWrite(DEFAULT_MOCK_ERC721_CONFIG, 'setOwner')

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log(`writing ${newAddress}`)
    write({ args: [newAddress] })
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
