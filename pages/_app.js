// pages/_app.js
import '../styles/globals.css';
import Script from 'next/script';

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      {/* GA4 */}
      {GA_ID && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_ID}', {
                linker: { domains: ['inunekotype.jp', 'inetan-16type-diagnosis.vercel.app'] }
              });
            `}
          </Script>
        </>
      )}

      <Component {...pageProps} />
    </>
  );
}
