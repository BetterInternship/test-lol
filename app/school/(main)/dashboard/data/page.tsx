import React from "react";
import { ContentLayout } from "@/components/features/school/ui/admin-panel/content-layout";
import { CompanyData, FeedbackData, HiringData } from "@/types";
import { ACADEMIC_YEARS, DEPARTMENTS, MOCK_COMPANIES } from "@/lib/utils";
import { InternshipDataTable } from "@/components/features/school/dashboard/data/internship-data-table";

const generateMockHiringData = (count: number): HiringData[] => {
  const data: HiringData[] = [];
  for (let i = 1; i <= count; i++) {
    data.push({
      id: `hiring-${i}`,
      studentName: `Student ${String.fromCharCode(65 + (i % 26))}${i}`,
      program: DEPARTMENTS[i % DEPARTMENTS.length],
      companyName: MOCK_COMPANIES[i % MOCK_COMPANIES.length],
      jobTitle: `Intern Developer ${i}`,
      jobPosition: "Intern",
      jobPay:
        Math.random() > 0.5
          ? Math.floor(Math.random() * 10000 + 15000)
          : undefined,
      jobMode: i % 3 === 0 ? "Remote" : i % 3 === 1 ? "In-Person" : "Hybrid",
      jobLink: Math.random() > 0.7 ? `https://example.com/job/${i}` : undefined,
      applicationDate: new Date(
        2024,
        Math.floor(i / 5) % 12,
        (i % 28) + 1
      ).toISOString(),
      decisionDate:
        Math.random() > 0.3
          ? new Date(
              2024,
              (Math.floor(i / 5) % 12) + 1,
              (i % 28) + 1
            ).toISOString()
          : undefined,
      decision:
        i % 4 === 0
          ? "Accepted"
          : i % 4 === 1
          ? "Offer Received"
          : i % 4 === 2
          ? "Pending"
          : "Rejected",
      moaSubmissionDate:
        Math.random() > 0.5
          ? new Date(
              2024,
              (Math.floor(i / 5) % 12) + 1,
              (i % 28) + 5
            ).toISOString()
          : undefined,
      jobDescriptionSubmissionDate:
        Math.random() > 0.6
          ? new Date(
              2024,
              (Math.floor(i / 5) % 12) + 1,
              (i % 28) + 6
            ).toISOString()
          : undefined,
    });
  }
  return data;
};

const generateMockFeedbackData = (count: number): FeedbackData[] => {
  const data: FeedbackData[] = [];
  for (let i = 1; i <= count; i++) {
    const weeklyFeedbacks = [];
    for (let w = 1; w <= 12; w++) {
      if (Math.random() > 0.3) {
        // Simulate some weeks might not have feedback
        weeklyFeedbacks.push({
          weekNumber: w,
          feedbackText: `Feedback for week ${w}: Student ${i} did well on task A, needs improvement on task B. Lorem ipsum dolor sit amet.`,
        });
      }
    }
    data.push({
      id: `feedback-${i}`,
      studentName: `Student ${String.fromCharCode(65 + (i % 26))}${i}`,
      program: DEPARTMENTS[i % DEPARTMENTS.length],
      startDateOfInternship: new Date(
        2024,
        Math.floor(i / 5) % 12,
        (i % 28) + 1
      ).toISOString(),
      overallFeedback: `Overall, student ${i} performed satisfactorily. Showed initiative.`,
      tasksCompleted: `Completed project X, assisted with Y, documented Z.`,
      lessonsLearned: `Learned about agile methodologies, improved coding skills.`,
      areaOfImprovement: `Time management and more proactive communication.`,
      weeklyFeedbacks,
    });
  }
  return data;
};

const generateMockCompanyData = (count: number): CompanyData[] => {
  const data: CompanyData[] = [];
  for (let i = 1; i <= count; i++) {
    const activeStudentCount = Math.floor(Math.random() * 5);
    const pastStudentCount = Math.floor(Math.random() * 10);
    data.push({
      id: `company-${i}`,
      companyName: MOCK_COMPANIES[i % MOCK_COMPANIES.length],
      address: `${i * 100} Innovation Drive, Tech City, TC 12345`,
      phone: Math.random() > 0.4 ? `(555) 123-${1000 + i}` : undefined,
      moaDate:
        Math.random() > 0.2
          ? new Date(2023, Math.floor(i / 2) % 12, (i % 28) + 1).toISOString()
          : undefined,
      contactPersonName: `Contact Person ${i}`,
      contactPersonPhone:
        Math.random() > 0.3 ? `(555) 987-${1000 + i}` : undefined,
      contactPersonPosition:
        i % 2 === 0 ? "HR Manager" : "Internship Coordinator",
      activeStudents: Array.from({ length: activeStudentCount }, (_, k) => ({
        id: `student-active-${i}-${k}`,
        name: `Active Intern ${k + 1}`,
      })),
      pastStudents: Array.from({ length: pastStudentCount }, (_, k) => ({
        id: `student-past-${i}-${k}`,
        name: `Past Intern ${k + 1}`,
      })),
      studentRating:
        Math.random() > 0.1
          ? parseFloat((Math.random() * 2 + 3).toFixed(1))
          : undefined, // Rating between 3.0 and 5.0
    });
  }
  return data;
};

const Page = () => {
  const hiringData = generateMockHiringData(50);
  const feedbackData = generateMockFeedbackData(30);
  const companyData = generateMockCompanyData(15);
  return (
    <ContentLayout title={"Internship Data"}>
      <InternshipDataTable
        initialHiringData={hiringData}
        initialFeedbackData={feedbackData}
        initialCompanyData={companyData}
        availableDepartments={DEPARTMENTS}
        availableCompanies={MOCK_COMPANIES}
        availableAcademicYears={ACADEMIC_YEARS}
      />
    </ContentLayout>
  );
};

export default Page;
