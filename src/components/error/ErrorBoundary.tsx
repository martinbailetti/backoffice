import React, { ErrorInfo, ReactNode } from "react";
import { useTranslation } from "@/context/contextUtils";

function ErrorBoundaryMessage() {
  const t = useTranslation();

  return <div className="text">{t("something_went_wrong")}</div>;
}

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<Props, State> {
  timeoutId: NodeJS.Timeout | null = null; // Asegúrate de tener un lugar para almacenar la referencia del temporizador

  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    // Actualiza el estado para que el siguiente renderizado muestre la interfaz alternativa
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    /*         this.timeoutId = setTimeout(() => {
            window.location.reload();
        }, error_message_wait); */
  }

  componentWillUnmount() {
    // Limpiar el temporizador cuando el componente se va a desmontar
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }

  render() {
    if (this.state.hasError) {
      // Puedes renderizar cualquier interfaz alternativa
      return (
        <div className="error-panel">
          <div className="container">
            <ErrorBoundaryMessage />
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
