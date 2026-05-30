import { createContext, useState } from 'react'

export const ReportContext = createContext(null)

export function ReportProvider({ children }) {
  const [activeReport, setActiveReport] = useState(null)

  return (
    <ReportContext.Provider value={{ activeReport, setActiveReport }}>
      {children}
    </ReportContext.Provider>
  )
}
