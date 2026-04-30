/**
 * AppIsland — wrapper React island para Astro.
 * Importa el App.jsx completo del proyecto existente sin modificarlo.
 * Se monta con client:load en src/pages/index.astro.
 */
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from '@frontend/App.jsx'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 1000 * 60 * 5, retry: 1 },
  },
})

export default function AppIsland() {
  return (
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  )
}
