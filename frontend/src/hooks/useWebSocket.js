import { useEffect, useRef, useCallback } from 'react';

const useWebSocket = (onMessage) => {
  const ws = useRef(null);
  const reconnectTimeout = useRef(null);

  const connect = useCallback(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    const wsUrl = `${process.env.REACT_APP_WS_URL || 'wss://tmsbackend-api-f6gwc7ejfphmg5f3.southeastasia-01.azurewebsites.net'}?token=${token}`;
    ws.current = new WebSocket(wsUrl);

    ws.current.onopen = () => {
      console.log('WS connected');
      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current);
        reconnectTimeout.current = null;
      }
    };

    ws.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onMessage(data);
      } catch {}
    };

    ws.current.onclose = () => {
      console.log('WS disconnected, reconnecting...');
      // Retry with backoff (3 seconds)
      reconnectTimeout.current = setTimeout(connect, 3000);
    };

    ws.current.onerror = () => {
      ws.current?.close();
    };
  }, [onMessage]);

  useEffect(() => {
    connect();
    return () => {
      if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current);
      ws.current?.close();
    };
  }, [connect]);
};

export default useWebSocket;
