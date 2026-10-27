import { useEffect, useState } from 'react'

// Persiste o estado no navegador (substitui o backend por enquanto)
export default function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key)
      return saved !== null ? JSON.parse(saved) : initialValue
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // armazenamento indisponível: ignora
    }
  }, [key, value])

  return [value, setValue]
}
