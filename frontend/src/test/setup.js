import '@testing-library/jest-dom/vitest'
import { afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'

// jsdom não implementa rolagem de tela
window.scrollTo = vi.fn()

// Isola cada teste: desmonta a tela e limpa o "banco" local
afterEach(() => {
  cleanup()
  localStorage.clear()
})
