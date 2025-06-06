import { useEffect, useState, useContext } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "@/context/AppContext";
import { config } from "@/lib/config";
import BouncingDotsLoader from "@/components/ui/bounce-loader";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { QRCodeSVG } from "qrcode.react";
import { Download } from "lucide-react";

type PDF = {
  id: string;
  name: string;
  slug: string;
  file_path: string;
  created_at: string;
};

export default function PDFListPage() {
  const [pdfs, setPdfs] = useState<PDF[]>([]);
  const [loading, setLoading] = useState(true);
  const [addButtonDisabled, setAddButtonDisabled] = useState(true);
  const [qrDialogOpen, setQrDialogOpen] = useState(false);
  const [currentQrUrl, setCurrentQrUrl] = useState("");

  const context = useContext(AppContext);
  if (!context) throw new Error("AppContext must be used within an AppProvider");

  const { token } = context;
  const navigate = useNavigate();

  useEffect(() => {
    fetchPDFs();
  }, []);

  useEffect(() => {
    // Disable button if there's 1 or more PDFs
    setAddButtonDisabled(pdfs.length >= 3);
  }, [pdfs]);

  const fetchPDFs = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${config.backend_url}/api/pdfs`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch PDFs");
      const data = await res.json();
      setPdfs(data);
    } catch (error) {
      toast.error("Error loading PDF list");
      console.log("ERROR---", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNewPDF = () => {
    navigate("/dashboard/pdf/create");
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleShowQrCode = (slug: string) => {
    setCurrentQrUrl(`${config.public_url}/${slug}`);
    setQrDialogOpen(true);
  };

  const handleDownloadQrCode = () => {
    const svg = document.getElementById("qr-code") as HTMLElement;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = `QRCode-${currentQrUrl.split("/").pop()}`;
      downloadLink.href = `${pngFile}`;
      downloadLink.click();
    };

    img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <BouncingDotsLoader />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold tracking-tight">Your Uploaded Menus</h2>
        <Button
          onClick={handleAddNewPDF}
          disabled={addButtonDisabled}
          className="w-full md:w-auto"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New Menu
        </Button>
      </div>

      {pdfs.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <p className="text-muted-foreground">No menus uploaded yet.</p>
        </div>
      ) : (
        <div className="rounded-lg border overflow-hidden">
          <Table className="min-w-full divide-y divide-gray-200">
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Menu Name
                </TableHead>
                <TableHead className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                  Uploaded On
                </TableHead>
                <TableHead className="px-4 py-3 text-right text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="bg-white divide-y divide-gray-200">
              {pdfs.map((pdf) => (
                <TableRow key={pdf.id} className="hover:bg-gray-50">
                  <TableCell className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {pdf.name}
                    </div>
                    <div className="text-sm text-gray-500 sm:hidden">
                      {formatDate(pdf.created_at)}
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-4 whitespace-nowrap hidden sm:table-cell">
                    <div className="text-sm text-gray-500">
                      {formatDate(pdf.created_at)}
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleShowQrCode(pdf.slug)}
                    >
                      Get QR Code
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/${pdf.slug}`)}
                    >
                      View Menu
                    </Button> 
                     {/* <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`pdf/create/${pdf.id}`)}
                    >
                      Update Menu
                    </Button> */}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={qrDialogOpen} onOpenChange={setQrDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>QR Code</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center space-y-4">
            <QRCodeSVG
              id="qr-code"
              value={currentQrUrl}
              size={256}
              level="H"
              includeMargin={true}
            />
            <p className="text-sm text-muted-foreground break-all text-center">
              {currentQrUrl}
            </p>
            <Button onClick={handleDownloadQrCode} className="w-full">
              <Download className="mr-2 h-4 w-4" />
              Download QR Code
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}