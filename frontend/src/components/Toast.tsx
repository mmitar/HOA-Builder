export type ApiStatus = 'idle' | 'loading' | 'success' | 'error';

// Shared signature for App's flashMessage helper, so nested panels can report
// success/error through the same Toast without re-declaring the type.
export type FlashMessage = (status: ApiStatus, message: string, autoDismiss?: boolean) => void;

interface ToastProps {
  status: ApiStatus;
  message: string;
}

export function Toast({ status, message }: ToastProps) {
  if (!message) return null;
  return <div className={`toast toast-${status}`}>{message}</div>;
}   