import { RouterProvider } from 'react-router-dom'
import { router } from '@/router'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'
import { ThemeProvider } from '@/context/ThemeContext'

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>
    </ErrorBoundary>
  )
}
