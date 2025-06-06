import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, X, UploadCloud, FileText, CheckCircle2 } from "lucide-react";
import { config } from "@/lib/config";
import BouncingDotsLoader from "@/components/ui/bounce-loader";
import { AppContext } from "@/context/AppContext";
import { v4 as uuidv4 } from "uuid";
import { Progress } from "@/components/ui/progress";

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
  const [uploadProgress, setUploadProgress] = useState(0);
  const [fileError, setFileError] = useState("");

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

  const validateFile = (file: File) => {
    setFileError("");
    
    // Check file type
    if (file.type !== "application/pdf") {
      setFileError("Only PDF files are allowed");
      return false;
    }

    // Check file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      setFileError("File size must be less than 10MB");
      return false;
    }

    return true;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (validateFile(file)) {
      setFormData({ ...formData, file });
    } else {
      // Clear the input if validation fails
      e.target.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setUploadProgress(0);

    try {
      let finalFilePath = existingFilePath;

      if (!finalFilePath && formData.file) {
        const form = new FormData();
        form.append("file", formData.file);

        const xhr = new XMLHttpRequest();
        xhr.open("POST", `${config.backend_url}/api/upload`, true);
        xhr.setRequestHeader("Authorization", `Bearer ${token}`);

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const progress = Math.round((event.loaded / event.total) * 100);
            setUploadProgress(progress);
          }
        };

        const uploadPromise = new Promise((resolve, reject) => {
          xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              resolve(JSON.parse(xhr.responseText));
            } else {
              reject(new Error("Upload failed"));
            }
          };
          xhr.onerror = () => reject(new Error("Upload failed"));
          xhr.send(form);
        });

       const uploadResult = await uploadPromise as { file_path: string };
finalFilePath = uploadResult.file_path;
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
      setUploadProgress(0);
    }
  };

  if (loading) return <BouncingDotsLoader />;

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold tracking-tight">
          {isEditMode ? "Edit PDF Menu" : "Upload New Menu"}
        </h2>
        <Button
          variant="ghost"
          onClick={() => navigate("/dashboard/home")}
          className="self-end md:self-auto"
        >
          <X className="mr-2 h-4 w-4" />
          Cancel
        </Button>
      </div>

      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* PDF Upload Section */}
          <div className="space-y-4">
            <Label className="text-base">PDF File *</Label>
            <p className="text-sm text-muted-foreground">
              Upload a PDF file (max 10MB)
            </p>

            {existingFilePath ? (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-muted/50 p-4 rounded-lg border">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-blue-500" />
                  <a
                    href={`${config.backend_url}/${existingFilePath}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline font-medium"
                  >
                    View Current PDF
                  </a>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDeleteFile}
                  disabled={formLoading}
                >
                  Remove File
                </Button>
              </div>
            ) : (
              <>
                <label
                  htmlFor="pdf-upload"
                  className="relative flex flex-col items-center justify-center w-full p-8 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                >
                  <div className="flex flex-col items-center justify-center gap-2 text-center">
                    <UploadCloud className="h-8 w-8 text-muted-foreground" />
                    <p className="text-sm font-medium">
                      {formData.file ? (
                        <span className="text-primary">{formData.file.name}</span>
                      ) : (
                        <>
                          <span className="font-semibold">Click to upload</span> or
                          drag and drop
                        </>
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PDF up to 10MB
                    </p>
                  </div>
                  <Input
                    id="pdf-upload"
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileChange}
                    disabled={formLoading}
                    required={!existingFilePath}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </label>
                {fileError && (
                  <p className="text-sm font-medium text-destructive">
                    {fileError}
                  </p>
                )}
              </>
            )}

            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </div>
            )}

            {uploadProgress === 100 && (
              <div className="flex items-center gap-2 text-sm text-green-600">
                <CheckCircle2 className="h-4 w-4" />
                <span>Upload complete!</span>
              </div>
            )}
          </div>

          {/* Name Input */}
          <div className="space-y-4">
            <Label htmlFor="name" className="text-base">
              Menu Name (optional)
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="e.g., Summer Menu 2025"
              className="text-base py-4"
            />
            <p className="text-sm text-muted-foreground">
              Give your menu a recognizable name
            </p>
          </div>

          {/* Hidden Slug Field */}
          <input type="hidden" value={slug} readOnly />

          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              disabled={formLoading || (!existingFilePath && !formData.file)}
              className="w-full md:w-auto"
              size="lg"
            >
              {formLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditMode ? "Update Menu" : "Upload Menu"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}