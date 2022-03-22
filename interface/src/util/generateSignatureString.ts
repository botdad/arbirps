export const generateSignatureString = (nonce: number, arbibotId: string): string => {
  return `May the gods of round ${nonce + 1} be in your favor, Bot ${arbibotId}.`
}
