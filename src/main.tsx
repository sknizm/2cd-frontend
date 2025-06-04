import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import AppProvider from './context/AppContext.tsx'
import { CartProvider } from './context/CartContext.tsx'

createRoot(document.getElementById('root')!).render(
  <AppProvider>
    <CartProvider>
<App />
    </CartProvider>
    
  </AppProvider>,
)
