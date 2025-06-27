import React, { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CircleCheckBig } from "lucide-react";
import { cn } from "@/lib/utils";
import StudentHistoryModal from "./student-history-modal";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

// Define types for student and document status
interface Student {
    id: string;
    name: string;
    src: string;
}

interface DocumentStatus {
    prefix: string; // Added prefix
    baseName: string; // Changed name to baseName
    category: 'pre-deployment' | 'deployment' | 'post-deployment';
    status: 'generated' | 'in-progress' | 'submitted';
    lastUpdate: string;
    pdfUrl?: string;
}

interface StudentWithDocuments extends Student {
    documents: DocumentStatus[];
}

interface InternshipDataForm {
    prefix: string; // Added prefix
    baseName: string; // Changed name to baseName
    pdfUrl: string;
    interns: Student[];
}

interface InternshipCategory {
    id: string;
    title: string;
    forms: InternshipDataForm[];
}

interface TrustModeTableProps {
    students: Student[]; // Original mockStudents
    internshipData: InternshipCategory[]; // Original internshipData
}

// Helper function to get color class for overall stage status (for mobile summary)
const getOverallStageColorClass = (status: 'muted' | 'yellow' | 'green' | string) => {
    switch (status) {
        case 'green':
            return "text-green-500";
        case 'yellow':
            return "text-yellow-500";
        case 'muted':
        default:
            return "text-muted-foreground";
    }
};

// Helper function to get color class for individual document status (for desktop icons)
const getDocumentStatusColorClass = (status: DocumentStatus['status']) => {
    switch (status) {
        case 'submitted':
            return "text-green-500";
        case 'in-progress':
            return "text-yellow-500";
        case 'generated':
        default:
            return "text-muted-foreground"; // Muted
    }
};

const COMMON_PREFIX = "[DLSU-CCS-DIT] ";

const mockStudentProgressData: StudentWithDocuments[] = [
    {
        id: "marcus-reid",
        name: "Marcus Reid",
        src: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde",
        documents: [
            { prefix: COMMON_PREFIX, baseName: "OJT Student MOA", category: "pre-deployment", status: "submitted", lastUpdate: "2023-10-26", pdfUrl: "/fake-docs/ojt-moa.pdf" },
            { prefix: COMMON_PREFIX, baseName: "Internship Plan", category: "pre-deployment", status: "submitted", lastUpdate: "2023-10-25", pdfUrl: "/fake-docs/internship-plan.pdf" },
            { prefix: COMMON_PREFIX, baseName: "Training Plan", category: "pre-deployment", status: "in-progress", lastUpdate: "2023-10-24", pdfUrl: "/fake-docs/training-plan.pdf" },
            { prefix: COMMON_PREFIX, baseName: "Weekly/Monthly Status Report", category: "deployment", status: "submitted", lastUpdate: "2023-11-10", pdfUrl: "/fake-docs/status-report.pdf" },
            { prefix: COMMON_PREFIX, baseName: "Weekly/Monthly Attendance Sheet", category: "deployment", status: "in-progress", lastUpdate: "2023-11-08", pdfUrl: "/fake-docs/attendance-sheet.pdf" },
            { prefix: COMMON_PREFIX, baseName: "Certificate of Completion", category: "post-deployment", status: "generated", lastUpdate: "2024-01-15", pdfUrl: "/fake-docs/coc.pdf" },
        ],
    },
    {
        id: "elara-vance",
        name: "Elara Vance",
        src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
        documents: [
            { prefix: COMMON_PREFIX, baseName: "OJT Student MOA", category: "pre-deployment", status: "submitted", lastUpdate: "2023-10-27", pdfUrl: "/fake-docs/ojt-moa.pdf" },
            { prefix: COMMON_PREFIX, baseName: "Internship Plan", category: "pre-deployment", status: "submitted", lastUpdate: "2023-10-26", pdfUrl: "/fake-docs/internship-plan.pdf" },
            { prefix: COMMON_PREFIX, baseName: "Training Plan", category: "pre-deployment", status: "submitted", lastUpdate: "2023-10-25", pdfUrl: "/fake-docs/training-plan.pdf" },
            { prefix: COMMON_PREFIX, baseName: "Weekly/Monthly Status Report", category: "deployment", status: "submitted", lastUpdate: "2023-11-12", pdfUrl: "/fake-docs/status-report.pdf" },
            { prefix: COMMON_PREFIX, baseName: "Weekly/Monthly Attendance Sheet", category: "deployment", status: "submitted", lastUpdate: "2023-11-10", pdfUrl: "/fake-docs/attendance-sheet.pdf" },
            { prefix: COMMON_PREFIX, baseName: "Certificate of Completion", category: "post-deployment", status: "in-progress", lastUpdate: "2024-01-16", pdfUrl: "/fake-docs/coc.pdf" },
            { prefix: COMMON_PREFIX, baseName: "Certificate of Attendance", category: "post-deployment", status: "generated", lastUpdate: "2024-01-15", pdfUrl: "/fake-docs/coa.pdf" },
        ],
    },
    {
        id: "liam-chen",
        name: "Liam Chen",
        src: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
        documents: [
            { prefix: COMMON_PREFIX, baseName: "OJT Student MOA", category: "pre-deployment", status: "in-progress", lastUpdate: "2023-10-28", pdfUrl: "/fake-docs/ojt-moa.pdf" },
            { prefix: COMMON_PREFIX, baseName: "Internship Plan", category: "pre-deployment", status: "generated", lastUpdate: "2023-10-27", pdfUrl: "/fake-docs/internship-plan.pdf" },
            { prefix: COMMON_PREFIX, baseName: "Weekly/Monthly Status Report", category: "deployment", status: "in-progress", lastUpdate: "2023-11-11", pdfUrl: "/fake-docs/status-report.pdf" },
            { prefix: COMMON_PREFIX, baseName: "Certificate of Completion", category: "post-deployment", status: "generated", lastUpdate: "2024-01-17", pdfUrl: "/fake-docs/coc.pdf" },
        ],
    },
    {
        id: "aria-kim",
        name: "Aria Kim",
        src: "https://images.unsplash.com/photo-1580489944761-15a19d654956",
        documents: [
            { prefix: COMMON_PREFIX, baseName: "OJT Student MOA", category: "pre-deployment", status: "submitted", lastUpdate: "2023-10-29", pdfUrl: "/fake-docs/ojt-moa.pdf" },
            { prefix: COMMON_PREFIX, baseName: "Internship Plan", category: "pre-deployment", status: "submitted", lastUpdate: "2023-10-28", pdfUrl: "/fake-docs/internship-plan.pdf" },
            { prefix: COMMON_PREFIX, baseName: "Weekly/Monthly Status Report", category: "deployment", status: "submitted", lastUpdate: "2023-11-13", pdfUrl: "/fake-docs/status-report.pdf" },
            { prefix: COMMON_PREFIX, baseName: "Weekly/Monthly Attendance Sheet", category: "deployment", status: "submitted", lastUpdate: "2023-11-11", pdfUrl: "/fake-docs/attendance-sheet.pdf" },
            { prefix: COMMON_PREFIX, baseName: "Certificate of Completion", category: "post-deployment", status: "submitted", lastUpdate: "2024-01-18", pdfUrl: "/fake-docs/coc.pdf" },
            { prefix: COMMON_PREFIX, baseName: "Certificate of Attendance", category: "post-deployment", status: "submitted", lastUpdate: "2024-01-17", pdfUrl: "/fake-docs/coa.pdf" },
            { prefix: COMMON_PREFIX, baseName: "Student Evaluation", category: "post-deployment", status: "submitted", lastUpdate: "2024-01-16", pdfUrl: "/fake-docs/student-eval.pdf" },
        ],
    },
    {
        id: "javier-rodriguez",
        name: "Javier Rodriguez",
        src: "https://images.unsplash.com/photo-1633332755192-727a05c4013d",
        documents: [
            { prefix: COMMON_PREFIX, baseName: "OJT Student MOA", category: "pre-deployment", status: "submitted", lastUpdate: "2023-10-30", pdfUrl: "/fake-docs/ojt-moa.pdf" },
            { prefix: COMMON_PREFIX, baseName: "Internship Plan", category: "pre-deployment", status: "in-progress", lastUpdate: "2023-10-29", pdfUrl: "/fake-docs/internship-plan.pdf" },
            { prefix: COMMON_PREFIX, baseName: "Weekly/Monthly Status Report", category: "deployment", status: "generated", lastUpdate: "2023-11-14", pdfUrl: "/fake-docs/status-report.pdf" },
        ],
    },
    {
        id: "sofia-petrov",
        name: "Sofia Petrov",
        src: "https://images.unsplash.com/photo-1544005313-94ddf0286df2",
        documents: [
            { prefix: COMMON_PREFIX, baseName: "OJT Student MOA", category: "pre-deployment", status: "submitted", lastUpdate: "2023-10-31", pdfUrl: "/fake-docs/ojt-moa.pdf" },
            { prefix: COMMON_PREFIX, baseName: "Internship Plan", category: "pre-deployment", status: "submitted", lastUpdate: "2023-10-30", pdfUrl: "/fake-docs/internship-plan.pdf" },
            { prefix: COMMON_PREFIX, baseName: "Training Plan", category: "pre-deployment", status: "submitted", lastUpdate: "2023-10-29", pdfUrl: "/fake-docs/training-plan.pdf" },
            { prefix: COMMON_PREFIX, baseName: "Weekly/Monthly Status Report", category: "deployment", status: "submitted", lastUpdate: "2023-11-15", pdfUrl: "/fake-docs/status-report.pdf" },
            { prefix: COMMON_PREFIX, baseName: "Weekly/Monthly Attendance Sheet", category: "deployment", status: "submitted", lastUpdate: "2023-11-13", pdfUrl: "/fake-docs/attendance-sheet.pdf" },
            { prefix: COMMON_PREFIX, baseName: "Certificate of Completion", category: "post-deployment", status: "submitted", lastUpdate: "2024-01-19", pdfUrl: "/fake-docs/coc.pdf" },
            { prefix: COMMON_PREFIX, baseName: "Certificate of Attendance", category: "post-deployment", status: "submitted", lastUpdate: "2024-01-18", pdfUrl: "/fake-docs/coa.pdf" },
            { prefix: COMMON_PREFIX, baseName: "Student Evaluation", category: "post-deployment", status: "submitted", lastUpdate: "2024-01-17", pdfUrl: "/fake-docs/student-eval.pdf" },
        ],
    },
    {
        id: "caleb-jones",
        name: "Caleb Jones",
        src: "https://images.unsplash.com/photo-1527980965255-d3b416303d12",
        documents: [
            { prefix: COMMON_PREFIX, baseName: "OJT Student MOA", category: "pre-deployment", status: "generated", lastUpdate: "2023-11-01", pdfUrl: "/fake-docs/ojt-moa.pdf" },
            { prefix: COMMON_PREFIX, baseName: "Weekly/Monthly Status Report", category: "deployment", status: "generated", lastUpdate: "2023-11-16", pdfUrl: "/fake-docs/status-report.pdf" },
        ],
    },
    {
        id: "nora-patel",
        name: "Nora Patel",
        src: "",
        documents: [
            { prefix: COMMON_PREFIX, baseName: "OJT Student MOA", category: "pre-deployment", status: "submitted", lastUpdate: "2023-11-02", pdfUrl: "/fake-docs/ojt-moa.pdf" },
            { prefix: COMMON_PREFIX, baseName: "Internship Plan", category: "pre-deployment", status: "submitted", lastUpdate: "2023-11-01", pdfUrl: "/fake-docs/internship-plan.pdf" },
            { prefix: COMMON_PREFIX, baseName: "Training Plan", category: "pre-deployment", status: "submitted", lastUpdate: "2023-10-31", pdfUrl: "/fake-docs/training-plan.pdf" },
            { prefix: COMMON_PREFIX, baseName: "Weekly/Monthly Status Report", category: "deployment", status: "submitted", lastUpdate: "2023-11-17", pdfUrl: "/fake-docs/status-report.pdf" },
            { prefix: COMMON_PREFIX, baseName: "Weekly/Monthly Attendance Sheet", category: "deployment", status: "submitted", lastUpdate: "2023-11-15", pdfUrl: "/fake-docs/attendance-sheet.pdf" },
            { prefix: COMMON_PREFIX, baseName: "Certificate of Completion", category: "post-deployment", status: "submitted", lastUpdate: "2024-01-20", pdfUrl: "/fake-docs/coc.pdf" },
            { prefix: COMMON_PREFIX, baseName: "Certificate of Attendance", category: "post-deployment", status: "submitted", lastUpdate: "2024-01-19", pdfUrl: "/fake-docs/coa.pdf" },
            { prefix: COMMON_PREFIX, baseName: "Student Evaluation", category: "post-deployment", status: "submitted", lastUpdate: "2024-01-18", pdfUrl: "/fake-docs/student-eval.pdf" },
        ],
    },
    {
        id: "owen-miller",
        name: "Owen Miller",
        src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
        documents: [
            { prefix: COMMON_PREFIX, baseName: "OJT Student MOA", category: "pre-deployment", status: "in-progress", lastUpdate: "2023-11-03", pdfUrl: "/fake-docs/ojt-moa.pdf" },
            { prefix: COMMON_PREFIX, baseName: "Internship Plan", category: "pre-deployment", status: "generated", lastUpdate: "2023-11-02", pdfUrl: "/fake-docs/internship-plan.pdf" },
            { prefix: COMMON_PREFIX, baseName: "Weekly/Monthly Status Report", category: "deployment", status: "in-progress", lastUpdate: "2023-11-18", pdfUrl: "/fake-docs/status-report.pdf" },
        ],
    },
];


const TrustModeTable: React.FC<TrustModeTableProps> = ({ internshipData }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<StudentWithDocuments | null>(null);

    const handleViewHistory = (student: StudentWithDocuments) => {
        setSelectedStudent(student);
        setIsModalOpen(true);
    };

    // Function to calculate stage status for a student (for mobile summary)
    const getStageStatus = (student: StudentWithDocuments, categoryId: string) => {
        const categoryForms = internshipData.find(cat => cat.id === categoryId)?.forms || [];
        const totalFormsInStage = categoryForms.length;

        if (totalFormsInStage === 0) {
            return { status: 'muted', completedCount: 0, totalCount: 0 };
        }

        const studentFormsInStage = student.documents.filter(doc => doc.category === categoryId);

        const submittedCount = studentFormsInStage.filter(doc => doc.status === 'submitted').length;
        const inProgressCount = studentFormsInStage.filter(doc => doc.status === 'in-progress').length;
        const generatedCount = studentFormsInStage.filter(doc => doc.status === 'generated').length;

        if (submittedCount === totalFormsInStage) {
            return { status: 'green', completedCount: submittedCount, totalCount: totalFormsInStage };
        } else if (submittedCount > 0 || inProgressCount > 0 || generatedCount > 0) {
            return { status: 'yellow', completedCount: submittedCount, totalCount: totalFormsInStage };
        } else {
            return { status: 'muted', completedCount: 0, totalCount: totalFormsInStage };
        }
    };

    // Helper to get expected forms for a category
    const getExpectedForms = (categoryId: string) => {
        return internshipData.find(cat => cat.id === categoryId)?.forms || [];
    };

    const expectedPreDeploymentForms = getExpectedForms("pre-deployment");
    const expectedDeploymentForms = getExpectedForms("deployment");
    const expectedPostDeploymentForms = getExpectedForms("post-deployment");

    return (
        <div className="w-full overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[20%]">Student</TableHead>
                        <TableHead className="w-[20%] text-center">Pre-Deployment</TableHead>
                        <TableHead className="w-[20%] text-center">Deployment</TableHead>
                        <TableHead className="w-[20%] text-center">Post-Deployment</TableHead>
                        <TableHead className="w-[20%] text-right">Full History</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {mockStudentProgressData.map((student) => {
                        const preDeploymentStatusSummary = getStageStatus(student, "pre-deployment");
                        const deploymentStatusSummary = getStageStatus(student, "deployment");
                        const postDeploymentStatusSummary = getStageStatus(student, "post-deployment");

                        return (
                            <TableRow key={student.id}>
                                <TableCell className="flex items-center gap-3 py-3">
                                    <Avatar className="h-9 w-9">
                                        <AvatarImage src={student.src} alt={student.name} />
                                        <AvatarFallback>
                                            {student.name.split(" ").map((n) => n[0]).join("")}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span className="font-medium">{student.name}</span>
                                </TableCell>

                                {/* Pre-Deployment Column */}
                                <TableCell className="text-center py-3">
                                    {/* Desktop view: individual icons */}
                                    <div className="hidden sm:flex items-center justify-center gap-1 flex-wrap">
                                        {expectedPreDeploymentForms.map((expectedForm, formIndex) => {
                                            const studentDoc = student.documents.find(
                                                (doc) => doc.prefix + doc.baseName === expectedForm.prefix + expectedForm.baseName && doc.category === "pre-deployment"
                                            );
                                            const status = studentDoc ? studentDoc.status : 'generated'; // Default to 'generated' (muted) if not found
                                            const tooltipText = studentDoc
                                                ? `${studentDoc.prefix}${studentDoc.baseName} (${studentDoc.status.replace('-', ' ')})`
                                                : `${expectedForm.prefix}${expectedForm.baseName} (Not yet generated)`;
                                            return (
                                                <Tooltip key={formIndex}>
                                                    <TooltipTrigger asChild>
                                                        <CircleCheckBig className={cn("h-5 w-5", getDocumentStatusColorClass(status))} />
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>{tooltipText}</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            );
                                        })}
                                    </div>
                                    {/* Mobile view: summary count */}
                                    <div className={cn("flex sm:hidden items-center justify-center gap-1", getOverallStageColorClass(preDeploymentStatusSummary.status))}>
                                        <CircleCheckBig className="h-5 w-5" />
                                        <span>{preDeploymentStatusSummary.completedCount}/{preDeploymentStatusSummary.totalCount}</span>
                                    </div>
                                </TableCell>

                                {/* Deployment Column */}
                                <TableCell className="text-center py-3">
                                    {/* Desktop view: individual icons */}
                                    <div className="hidden sm:flex items-center justify-center gap-1 flex-wrap">
                                        {expectedDeploymentForms.map((expectedForm, formIndex) => {
                                            const studentDoc = student.documents.find(
                                                (doc) => doc.prefix + doc.baseName === expectedForm.prefix + expectedForm.baseName && doc.category === "deployment"
                                            );
                                            const status = studentDoc ? studentDoc.status : 'generated';
                                            const tooltipText = studentDoc
                                                ? `${studentDoc.prefix}${studentDoc.baseName} (${studentDoc.status.replace('-', ' ')})`
                                                : `${expectedForm.prefix}${expectedForm.baseName} (Not yet generated)`;
                                            return (
                                                <Tooltip key={formIndex}>
                                                    <TooltipTrigger asChild>
                                                        <CircleCheckBig className={cn("h-5 w-5", getDocumentStatusColorClass(status))} />
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>{tooltipText}</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            );
                                        })}
                                    </div>
                                    {/* Mobile view: summary count */}
                                    <div className={cn("flex sm:hidden items-center justify-center gap-1", getOverallStageColorClass(deploymentStatusSummary.status))}>
                                        <CircleCheckBig className="h-5 w-5" />
                                        <span>{deploymentStatusSummary.completedCount}/{deploymentStatusSummary.totalCount}</span>
                                    </div>
                                </TableCell>

                                {/* Post-Deployment Column */}
                                <TableCell className="text-center py-3">
                                    {/* Desktop view: individual icons */}
                                    <div className="hidden sm:flex items-center justify-center gap-1 flex-wrap">
                                        {expectedPostDeploymentForms.map((expectedForm, formIndex) => {
                                            const studentDoc = student.documents.find(
                                                (doc) => doc.prefix + doc.baseName === expectedForm.prefix + expectedForm.baseName && doc.category === "post-deployment"
                                            );
                                            const status = studentDoc ? studentDoc.status : 'generated';
                                            const tooltipText = studentDoc
                                                ? `${studentDoc.prefix}${studentDoc.baseName} (${studentDoc.status.replace('-', ' ')})`
                                                : `${expectedForm.prefix}${expectedForm.baseName} (Not yet generated)`;
                                            return (
                                                <Tooltip key={formIndex}>
                                                    <TooltipTrigger asChild>
                                                        <CircleCheckBig className={cn("h-5 w-5", getDocumentStatusColorClass(status))} />
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>{tooltipText}</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            );
                                        })}
                                    </div>
                                    {/* Mobile view: summary count */}
                                    <div className={cn("flex sm:hidden items-center justify-center gap-1", getOverallStageColorClass(postDeploymentStatusSummary.status))}>
                                        <CircleCheckBig className="h-5 w-5" />
                                        <span>{postDeploymentStatusSummary.completedCount}/{postDeploymentStatusSummary.totalCount}</span>
                                    </div>
                                </TableCell>

                                <TableCell className="text-right py-3">
                                    <Button variant="link" onClick={() => handleViewHistory(student)}>
                                        Link
                                    </Button>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
            <StudentHistoryModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                student={selectedStudent}
            />
        </div>
    );
};

export default TrustModeTable;