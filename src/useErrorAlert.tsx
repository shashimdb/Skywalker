import React, { useState, useEffect, useCallback } from "react";
import MuiAlert, { AlertProps } from "@mui/material/Alert";

interface ErrorAlertProps {
  isOpen: boolean;
  message: string;
  onClose?: () => void;
}

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export function ErrorAlert({ isOpen, message, onClose = () => {} }: ErrorAlertProps): JSX.Element | null {
  return isOpen ? (
    <Alert onClose={onClose} severity="error">
      {message}
    </Alert>
  ) : null;
}

interface UseErrorAlertProps {
  error: string | null;
  clearError: () => void;
  hideAfterMs?: number;
}

export function useErrorAlert({ error, clearError, hideAfterMs }: UseErrorAlertProps): JSX.Element {
  const [showErrorAlert, setShowErrorAlert] = useState(false);

  const clearErrorAlert = useCallback(() => {
    clearError();
    setShowErrorAlert(false);
  }, [clearError]);

  useEffect(() => {
    if (error) {
      setShowErrorAlert(true);
      if (hideAfterMs) {
        const timeout = setTimeout(() => {
          clearErrorAlert();
        }, hideAfterMs);
        return () => {
          clearTimeout(timeout);
        };
      }
    } else {
      setShowErrorAlert(false);
    }
  }, [error, clearErrorAlert, hideAfterMs]);

  return (
    <ErrorAlert
      isOpen={showErrorAlert}
      message={error || ""}
      onClose={() => {
        clearErrorAlert();
      }}
    />
  );
}
