import type { Metadata } from 'next';
import { Inter, Noto_Sans_Bengali } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const notoSansBengali = Noto_Sans_Bengali({
  subsets: ['bengali'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-noto-bengali',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'DokanKhata Pro — Shop & Service Manager',
  description:
    'Production-ready bilingual (Bangla + English) Shop Management Web App for Bangladeshi retail, mobile banking, servicing, and computer shops.',
  openGraph: {
    title: 'DokanKhata Pro — Shop & Service Manager',
    description:
      'Production-ready bilingual (Bangla + English) Shop Management Web App for Bangladeshi retail, mobile banking, servicing, and computer shops.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DokanKhata Pro — Shop & Service Manager',
    description:
      'Production-ready bilingual (Bangla + English) Shop Management Web App for Bangladeshi retail, mobile banking, servicing, and computer shops.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="bn" className={`${inter.variable} ${notoSansBengali.variable}`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var targets = [window, Object.getPrototypeOf(window), Object.getPrototypeOf(Object.getPrototypeOf(window))];
                  for (var i = 0; i < targets.length; i++) {
                    var t = targets[i];
                    if (!t) continue;
                    var desc = Object.getOwnPropertyDescriptor(t, 'fetch');
                    if (desc && !desc.set && (desc.get || !desc.writable)) {
                      var originalFetch = window.fetch ? window.fetch.bind(window) : undefined;
                      try {
                        Object.defineProperty(window, 'fetch', {
                          get: function() { return originalFetch; },
                          set: function(fn) { originalFetch = fn; },
                          configurable: true,
                          enumerable: true
                        });
                        break;
                      } catch(e) {}
                    }
                  }
                } catch(err) {}
              })();
            `,
          }}
        />
      </head>
      <body suppressHydrationWarning className="font-sans antialiased bg-slate-100/60 text-slate-900 min-h-screen">
        {children}
      </body>
    </html>
  );
}

