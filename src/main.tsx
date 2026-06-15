import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import AppProviders from './shared/app/AppProviders'
import './index.css'
import './shared/styles/style-button.css'
import './shared/styles/style-table.css'
import './shared/styles/app-modules.css'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
    
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <AppProviders />
        </QueryClientProvider>
    </StrictMode>,

)
