import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import AppProviders from './shared/app/AppProviders'
import './index.css'
import './shared/styles/style-button.css'
import './shared/styles/style-table.css'
import './shared/styles/app-modules.css'

createRoot(document.getElementById('root')!).render(
    
    <StrictMode>
        <AppProviders />
    </StrictMode>,

)
