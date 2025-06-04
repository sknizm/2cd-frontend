import { useEffect, useState, useContext } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "@/context/AppContext";
import { config } from "@/lib/config";
import BouncingDotsLoader from "@/components/ui/bounce-loader";

type PDF = {
  id: string;
  name: string;
  slug: string; // 👈 Add slug
  file_path: string;
  created_at: string;
};

export default function PDFListPage() {
  const [pdfs, setPdfs] = useState<PDF[]>([]);
  const [loading, setLoading] = useState(true);

  const context = useContext(AppContext);
  if (!context) throw new Error("AppContext must be used within an AppProvider");

  const { token } = context;
  const navigate = useNavigate();

  useEffect(() => {
    fetchPDFs();
  }, []);

  const fetchPDFs = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${config.backend_url}/api/pdfs`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!res.ok) throw new Error("Failed to fetch PDFs");
      const data = await res.json();
      console.log("PDFs---", data)
      setPdfs(data); // 👈 Make sure your backend includes `slug`
    } catch (error) {
      toast.error("Error loading PDF list");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNewPDF = () => {
    navigate("/dashboard/pdf/create");
  };

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <BouncingDotsLoader />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Your Uploaded Menus</h2>
        <Button onClick={handleAddNewPDF}>
          <Plus className="mr-2 h-4 w-4" />
          Add New Menu
        </Button>
      </div>

      {pdfs.length === 0 ? (
        <p className="text-center text-muted-foreground">No PDFs uploaded yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <Table className="min-w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="w-1/2">PDF Link</TableHead>
                <TableHead>PDF Name</TableHead>
                <TableHead>Uploaded On</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pdfs.map((pdf) => (
                <TableRow key={pdf.id}>
                  <TableCell>
                    <a
                      href={`/${pdf.slug}`} // 👈 Changed to public slug page
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      View PDF
                    </a>
                  </TableCell>
                  <TableCell>{pdf.name}</TableCell>
                  <TableCell>{new Date(pdf.created_at).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
