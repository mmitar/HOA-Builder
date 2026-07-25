type ApiStatus = 'idle' | 'loading' | 'success' | 'error';

interface ToastProps {
  status: ApiStatus;
  message: string;
}

export function Toast({ status, message }: ToastProps) {
  if (!message) return null;
  return <div className={`toast toast-${status}`}>{message}</div>;
}   