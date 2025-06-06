// src/pages/PdfPage.tsx
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { config } from '@/lib/config';
import { MembershipInactive } from '@/components/restaurant/MembershipInactive';
import { RestaurantError } from '@/components/restaurant/RestaurantError';
import { NotFound } from '@/components/restaurant/NotFound';
import { pageview } from '@/lib/gtag';

interface PdfData {
  name: string | null;
  file_path: string;
  url: string;
  restaurant_id: string;
}

export default function PdfPage() {
  const { slug } = useParams<{ slug: string }>();
  const [pdf, setPdf] = useState<PdfData | null>(null);
  const [loading, setLoading] = useState(true);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [error, setError] = useState<{
    type: 'not_found' | 'inactive' | 'other';
    message: string;
  } | null>(null);

  useEffect(() => {
    pageview('PDF Page');
  }, []);

  useEffect(() => {
    const fetchPdfData = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`${config.backend_url}/api/pdf/${slug}`);
        const data = await res.json();

        if (!res.ok || !data.success) {
          if (data.slug === false) {
            setError({ type: 'not_found', message: data.message || 'PDF not found' });
          } else if (data.membership === false) {
            setError({ type: 'inactive', message: data.message || 'Membership is not active' });
          } else {
            setError({ type: 'other', message: data.message || 'Failed to load PDF' });
          }
          return;
        }

        setPdf(data.pdf);
      } catch (err) {
        if (err)
          setError({
            type: 'other',
            message: 'Something went wrong. Please try again later.',
          });
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchPdfData();
    }
  }, [slug]);

  const handleIframeLoad = () => {
    setIframeLoaded(true);
  };

  if (loading) return <div className="p-4">Loading PDF...</div>;

  if (error) {
    if (error.type === 'not_found') return <NotFound />;
    if (error.type === 'inactive') return <MembershipInactive />;
    return <RestaurantError message={error.message} />;
  }

  if (!pdf) return null;

  const googleViewerUrl = `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(
    `${config.backend_url}/public/${pdf.file_path}`
  )}`;

  return (
    <div className="relative w-full h-screen bg-white">
      {/* Loader Overlay */}
      {!iframeLoaded && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white transition-opacity duration-300">
          <div className="flex space-x-3">
            <div className="w-5 h-5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-5 h-5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-5 h-5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
          <p className="mt-6 text-lg font-medium text-gray-600 animate-pulse">
            Loading menu...
          </p>
        </div>
      )}

      {/* PDF Viewer iframe */}
      <iframe
        title={pdf.name ?? 'PDF Viewer'}
        src={googleViewerUrl}
        className="w-full h-full border-none"
        onLoad={handleIframeLoad}
        style={{ display: iframeLoaded ? 'block' : 'none' }}
      />
    </div>
  );
}
