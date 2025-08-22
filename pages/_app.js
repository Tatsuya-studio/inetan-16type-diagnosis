// pages/_app.js
import '../styles/globals.css';
import Script from 'next/script';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

// ✅ どこからでも呼べる安全ラッパー
export function gtagEvent(name, params = {}) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function' && GA_ID) {
    window.gtag('event', name, params);
  }
}

export default function MyApp({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    if (!GA_ID) return;
    const handleRouteChange = (url) => {
      if (typeof window.gtag === 'function') {
        window.gtag('config', GA_ID, { page_path: url });
      }
    };
    // 初回
    handleRouteChange(window.location.pathname + window.location.search);
    // 以降の遷移
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => router.events.off('routeChangeComplete', handleRouteChange);
  }, [router.events]);

  return (
    <>
      {GA_ID && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            strategy="afterInteractive"
          />
          <Script id="ga-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_ID}', { send_page_view: false });
            `}
          </Script>
        </>
      )}
      <Component {...pageProps} />
    </>
  );
}
