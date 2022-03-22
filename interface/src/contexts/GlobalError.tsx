import React, { createContext, PropsWithChildren, ReactNode, useState } from 'react'

type ErrorContextType = {
  isDisplayed: boolean
  content: ReactNode
  show: (c: ReactNode) => void
  hide: () => void
}
const defaultValue: ErrorContextType = { isDisplayed: false, content: '', show: (c: ReactNode) => {}, hide: () => {} }
const GlobalError = createContext(defaultValue)

export const GlobalErrorProvider = (props: PropsWithChildren<any>) => {
  const [content, setContent] = useState<ReactNode>('')
  const [isDisplayed, display] = useState(false)

  const show = (c: ReactNode) => {
    setContent(c)
    display(true)
  }

  const hide = () => {
    display(false)
    setContent('')
  }

  const contextValue: ErrorContextType = {
    isDisplayed,
    content,
    show,
    hide,
  }

  return <GlobalError.Provider {...props} value={contextValue} />
}

export default GlobalError
