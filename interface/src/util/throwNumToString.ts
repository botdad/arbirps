export const throwNumToString = (throwNum: number): string => {
  if (throwNum === 0) {
    return 'Rock'
  }
  if (throwNum === 1) {
    return 'Paper'
  }
  return 'Scissors'
}
