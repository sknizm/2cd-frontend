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
  const [showLoader, setShowLoader] = useState(true);
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
        console.log("pdf", data)
        setPdf(data.pdf);

        // Show loader for 2 seconds
        setTimeout(() => setShowLoader(false), 2000);
      } catch (err) {
        if(err)
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

  if (loading) return <div className="p-4">Loading PDF...</div>;

  if (error) {
    if (error.type === 'not_found') return <NotFound />;
    if (error.type === 'inactive') return <MembershipInactive />;
    return <RestaurantError message={error.message} />;
  }

  if (!pdf) return null;

  const googleViewerUrl = `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(pdf.url)}`;

  return (
    <div className="relative w-full h-screen">
      {/* Loader Overlay */}
      {showLoader && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-white">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500" />
        </div>
      )}

      {/* PDF Viewer via Google Docs */}
      <iframe
        title={pdf.name ?? 'PDF Viewer'}
        src={googleViewerUrl}
        className="w-full h-full border-none"
      />
    </div>
  );
}
