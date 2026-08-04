import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { ThemeProvider } from './context/ThemeProvider'
import { TransactionsProvider } from './context/TransactionsProvider'
import { AddTransaction } from './pages/AddTransaction'
import { Dashboard } from './pages/Dashboard'
import { NotFound } from './pages/NotFound'
import { Summary } from './pages/Summary'
import { TransactionDetail } from './pages/TransactionDetail'

/**
 * Four real routes, each with its own URL, sharing one persistent shell.
 *
 * Both providers sit above the router so the theme and the transaction store
 * survive navigation — switching screens must not reset either one.
 */
export default function App() {
  return (
    <ThemeProvider>
      <TransactionsProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="add" element={<AddTransaction />} />
              <Route path="transaction/:id" element={<TransactionDetail />} />
              <Route path="summary" element={<Summary />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </TransactionsProvider>
    </ThemeProvider>
  )
}
