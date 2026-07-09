import { createContext, useContext, useState, useCallback } from 'react'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null)

  const show = useCallback((message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => {
      setToast(null)
    }, 3000)
  }, [])

  const dismiss = useCallback(() => setToast(null), [])

  return (
    <ToastContext.Provider value={{ show, dismiss }}>
      {children}
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] toast-enter" style={{ animation: 'toastIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}>
          <div className={`px-5 py-3 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.1)] flex items-center gap-2 font-label-md text-label-md backdrop-blur-md ${
            toast.type === 'success' ? 'bg-primary text-on-primary' :
            toast.type === 'error' ? 'bg-error-container text-on-error-container' :
            'bg-surface-container-high text-on-surface'
          }`}>
            <span className="material-symbols-outlined text-lg">
              {toast.type === 'success' ? 'check_circle' : toast.type === 'error' ? 'error' : 'info'}
            </span>
            {toast.message}
          </div>
        </div>
      )}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
