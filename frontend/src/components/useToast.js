import { useCallback, useEffect, useState } from "react";

// Petit message temporaire en bas de l'écran (remplace les alert())
export default function useToast() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => setMessage(""), 2800);
    return () => clearTimeout(t);
  }, [message]);

  return [message, useCallback((m) => setMessage(m), [])];
}
