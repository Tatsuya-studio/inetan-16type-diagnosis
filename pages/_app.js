// pages/_app.js
import Script from "next/script";
import { useEffect } from "react";
import { useRouter } from "next/router";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export default function MyApp({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    if (!GA_ID) return;
    const handleRouteChange = (url) => {
      window.gtag("config", GA_ID, {
        page_path: url,
      });
    };
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  return (
    <>
      {/* GA4 スクリプト読み込み */}
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
