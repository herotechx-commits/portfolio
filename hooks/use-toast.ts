import { toast as sonnerToast } from "sonner";

interface ToastOptions {
  duration?: number;
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left" | "top-center" | "bottom-center";
}

interface ToastMessage {
  title?: string;
  description?: string;
  type?: "success" | "error" | "info" | "warning";
}

export const useToast = () => {
  const showToast = ({ title, description, type = "info" }: ToastMessage, options?: ToastOptions) => {
    const toastOptions = {
      duration: options?.duration || 4000,
      position: options?.position || "top-center",
    };

    switch (type) {
      case "success":
        sonnerToast.success(title, {
          description,
          ...toastOptions,
        });
        break;
      case "error":
        sonnerToast.error(title, {
          description,
          ...toastOptions,
        });
        break;
      case "warning":
        sonnerToast.warning(title, {
          description,
          ...toastOptions,
        });
        break;
      default:
        sonnerToast.info(title, {
          description,
          ...toastOptions,
        });
    }
  };

  const successToast = (title: string, description?: string, options?: ToastOptions) => {
    showToast({ title, description, type: "success" }, options);
  };

  const errorToast = (title: string, description?: string, options?: ToastOptions) => {
    showToast({ title, description, type: "error" }, options);
  };

  const warningToast = (title: string, description?: string, options?: ToastOptions) => {
    showToast({ title, description, type: "warning" }, options);
  };

  const infoToast = (title: string, description?: string, options?: ToastOptions) => {
    showToast({ title, description, type: "info" }, options);
  };

  return {
    showToast,
    successToast,
    errorToast,
    warningToast,
    infoToast,
  };
};