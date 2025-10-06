import DashboardSection from "@/sections/dashboard";
import JobApplicationForm from "@/sections/JobApplicationForm";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <>
        <JobApplicationForm />
        <DashboardSection />
      </>
    </div>
  );
}
