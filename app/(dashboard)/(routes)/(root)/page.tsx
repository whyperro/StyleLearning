import { getDashboardCourses } from "@/actions/getDashboardCourses";
import { CoursesList } from "@/components/CoursesList";
import { UserButton, auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import InfoCard from "./_components/InfoCard";
import { CheckCircle, Clock } from "lucide-react";

export default async function Dashboard() {
  const { userId } = auth();

  if (!userId) {
    redirect("/");
  }

  const { completedCourses, coursesInProgress } = await getDashboardCourses(
    userId
  );

  return (
    <div className="p-6 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InfoCard
          label="En progreso"
          variant="default"
          icon={Clock}
          numberOfItems={coursesInProgress.length}
        />
        <InfoCard
          label="Completados"
          variant="success"
          icon={CheckCircle}
          numberOfItems={completedCourses.length}
        />
      </div>
      <CoursesList items={[...coursesInProgress, ...completedCourses]} />
    </div>
  );
}
