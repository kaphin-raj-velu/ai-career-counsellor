import "./globals.css";
import Script from "next/script";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>

        {/* Hidden Google Translator */}
        <div id="google_translate_element" style={{ display: "none" }}></div>

        {children}

        {/* Google Translate Initialization */}
        <Script id="google-translate-init">
          {`
            function googleTranslateElementInit() {
              new google.translate.TranslateElement(
                {
                  pageLanguage: 'en',
                  includedLanguages: 'en,hi,ta,te,kn,ml,fr',
                  autoDisplay: false
                },
                'google_translate_element'
              );
            }
          `}
        </Script>

        {/* Google Translate Script */}
        <Script
          src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
          strategy="afterInteractive"
        />

      </body>
    </html>
  );
}