export const generateSignatureString = (nonce: number, arbibotId: string): string => {
  return `Arbibot ${arbibotId} in bot paper scissors round ${nonce + 1}`
}
