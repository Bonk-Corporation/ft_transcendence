import React, { useEffect } from 'react';

export const Ping = () => {
  useEffect(() => {
    const sendPing = () => {
      fetch('/ping/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCookie('csrftoken'),
        },
        credentials: 'same-origin',
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          console.log('Ping response:', data);
        })
        .catch(error => {
          console.error('Ping error:', error);
        });
    };

    const getCookie = (name) => {
      let cookieValue = null;
      if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
          const cookie = cookies[i].trim();
          if (cookie.substring(0, name.length + 1) === (name + '=')) {
            cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
            break;
          }
        }
      }
      return cookieValue;
    };

    sendPing();
    const interval = setInterval(sendPing, 60000);

    window.addEventListener('beforeunload', sendPing);

    return () => {
      clearInterval(interval);
      window.removeEventListener('beforeunload', sendPing);
    };
  }, []);

  return null;
};
