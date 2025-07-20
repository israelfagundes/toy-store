import type { ReactNode } from "react";
import { toast as sonnerToast } from "sonner";

type ToastOptions = {
  title?: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  duration?: number;
  onAutoClose?: () => void;
};

function toast({
  title,
  description,
  action,
  duration = 4000,
  onAutoClose,
}: ToastOptions) {
  const id = sonnerToast(title, {
    description,
    duration,
    action,
    onAutoClose,
  });

  return {
    id,
    dismiss: () => sonnerToast.dismiss(id),
    update: (options: ToastOptions) =>
      sonnerToast.dismiss(id) ||
      sonnerToast(options.title, {
        ...options,
        id,
      }),
  };
}

function useToast() {
  return {
    toast,
    dismiss: sonnerToast.dismiss,
  };
}

export { useToast, toast };
