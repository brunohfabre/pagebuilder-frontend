import { BrowserRouter } from 'react-router-dom'

import { Provider } from '@siakit/core'
import { DialogProvider } from '@siakit/dialog'
import { LoadingProvider } from '@siakit/loading'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { AppRoutes } from './Routes/AppRoutes'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
})

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Provider>
        <LoadingProvider>
          <DialogProvider>
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </DialogProvider>
        </LoadingProvider>
      </Provider>
    </QueryClientProvider>
  )
}
