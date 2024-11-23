export const tokenToId = (token: string) => {
  return atob(token.split('.')[0])
}
