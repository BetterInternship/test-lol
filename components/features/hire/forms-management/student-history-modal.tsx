import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { CircleCheckBig } from "lucide-react";

interface DocumentStatus {
  prefix: string;
  baseName: string;
  category: "pre-deployment" | "deployment" | "post-deployment";
  status: "generated" | "in-progress" | "submitted";
  lastUpdate: string;
  pdfURL?: string;
}

interface StudentWithDocuments {
  id: string;
  name: string;
  src: string;
  documents: DocumentStatus[];
}

interface StudentHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: StudentWithDocuments | null;
}

const getStatusColorClass = (status: DocumentStatus["status"]) => {
  switch (status) {
    case "submitted":
      return "text-green-500";
    case "in-progress":
      return "text-yellow-500";
    case "generated":
    default:
      return "text-muted-foreground";
  }
};

const StudentHistoryModal: React.FC<StudentHistoryModalProps> = ({
  isOpen,
  onClose,
  student,
}) => {
  if (!student) return null;

  const handleDownload = (url: string, filename: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full h-[75vh] flex flex-col p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Document History for {student.name}
          </DialogTitle>
          <DialogDescription>
            Overview of all documents and their current status for{" "}
            {student.name}.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-grow overflow-y-auto mt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40%]">Document Name</TableHead>
                <TableHead className="w-[20%]">Category</TableHead>
                <TableHead className="w-[20%]">Last Update</TableHead>
                <TableHead className="w-[20%]">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {student.documents.map((doc, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">
                    {doc.pdfURL ? (
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handleDownload(
                            doc.pdfURL!,
                            doc.prefix + doc.baseName + ".pdf"
                          );
                        }}
                        className="text-blue-600 hover:underline"
                      >
                        {doc.prefix}
                        {doc.baseName}
                      </a>
                    ) : (
                      `${doc.prefix}${doc.baseName}`
                    )}
                  </TableCell>
                  <TableCell className="capitalize">
                    {doc.category.replace("-", " ")}
                  </TableCell>
                  <TableCell>{doc.lastUpdate}</TableCell>
                  <TableCell
                    className={cn(
                      "flex items-center gap-2",
                      getStatusColorClass(doc.status)
                    )}
                  >
                    <CircleCheckBig className="h-4 w-4" />
                    <span className="capitalize">
                      {doc.status.replace("-", " ")}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StudentHistoryModal;
