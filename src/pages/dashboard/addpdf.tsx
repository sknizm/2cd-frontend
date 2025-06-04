// Imports remain unchanged
import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, X } from "lucide-react";
import { config } from "@/lib/config";
import BouncingDotsLoader from "@/components/ui/bounce-loader";
import { AppContext } from "@/context/AppContext";
import { v4 as uuidv4 } from "uuid";

export default function PdfUploadForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const context = useContext(AppContext);
  if (!context) throw new Error("AppContext must be used within an AppProvider");
  const { token } = context;

  const [formData, setFormData] = useState<{ name: string; file: File | null }>({
    name: "",
    file: null,
  });

  const [slug, setSlug] = useState<string>(uuidv4());
  const [existingFilePath, setExistingFilePath] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    const loadPdf = async () => {
      if (!isEditMode || !id) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${config.backend_url}/api/pdfs/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch PDF");
        const data = await res.json();

        setFormData({ name: data.name || "", file: null });
        setSlug(data.slug);
        setExistingFilePath(data.file_path);
      } catch (err) {
        toast.error("Failed to load PDF");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadPdf();
  }, [id, isEditMode, token]);

  const handleDeleteFile = async () => {
    if (!existingFilePath) return;

    try {
      const res = await fetch(`${config.backend_url}/api/delete-pdf-file`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ file_path: existingFilePath }),
      });

      if (!res.ok) throw new Error("Delete failed");

      setExistingFilePath("");
      toast.success("PDF deleted");
    } catch (err) {
      toast.error("Delete failed");
      console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setFormLoading(true);

    try {
      let finalFilePath = existingFilePath;

      if (!finalFilePath && formData.file) {
        const form = new FormData();
        form.append("file", formData.file);

        const uploadRes = await fetch(`${config.backend_url}/api/upload`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: form,
        });
        console.log("RESPONSE-----", uploadRes)
        if (!uploadRes.ok) throw new Error("Upload failed");
        const uploadData = await uploadRes.json();
        finalFilePath = uploadData.file_path;
        toast.success("PDF uploaded");
      }

      if (!finalFilePath) {
        toast.error("Please select a PDF file to upload");
        return;
      }

      const payload = {
        name: formData.name,
        slug,
        file_path: finalFilePath,
      };

      const url = isEditMode
        ? `${config.backend_url}/api/pdfs/${id}`
        : `${config.backend_url}/api/pdfs`;
      const method = isEditMode ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Submit failed");

      toast.success(`PDF ${isEditMode ? "updated" : "uploaded"} successfully`);
      navigate("/dashboard/home");
    } catch (err) {
      toast.error("Failed to upload or save PDF");
      console.error(err);
    } finally {
      setFormLoading(false);
    }
  };

  if (loading) return <BouncingDotsLoader />;

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{isEditMode ? "Edit PDF" : "Upload PDF"}</h2>
        <Button variant="ghost" onClick={() => navigate("/dashboard/pdfs")}>
          <X className="mr-2 h-4 w-4" />
          Cancel
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* PDF Upload Field at Top */}
        <div className="space-y-2">
          <Label>PDF File *</Label>
          {existingFilePath ? (
            <div className="flex items-center justify-between bg-gray-100 px-4 py-2 rounded">
              <a
                href={`${config.backend_url}/${existingFilePath}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                View PDF
              </a>
              <Button variant="destructive" size="sm" onClick={handleDeleteFile} disabled={formLoading}>
                Delete File
              </Button>
            </div>
          ) : (
            <Input
              type="file"
              accept="application/pdf"
              onChange={(e) => setFormData({ ...formData, file: e.target.files?.[0] || null })}
              disabled={formLoading}
              required={!existingFilePath}
            />
          )}
        </div>

        {/* Name Input */}
        <div className="space-y-2">
          <Label htmlFor="name">PDF Name (optional)</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., Menu June 2025"
          />
        </div>

        {/* Hidden Slug Field */}
        <input type="hidden" value={slug} readOnly />

        <div className="flex justify-end">
          <Button type="submit" disabled={formLoading}>
            {formLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditMode ? "Update PDF" : "Upload PDF"}
          </Button>
        </div>
      </form>
    </div>
  );
}
