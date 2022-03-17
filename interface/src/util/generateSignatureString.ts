export const generateSignatureString = (nonce: number, arbibotId: string): string => {
  return `Arbibots!! RPS round ${nonce + 1}`
}
