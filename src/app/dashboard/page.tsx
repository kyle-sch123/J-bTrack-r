import DashboardSection from "@/sections/dashboard";
import Footer from "@/sections/footer";
import JobApplicationForm from "@/sections/JobApplicationForm";
import Navbar from "@/sections/navbar";

export default function Home() {
  return (
    <div>
      <>
        <Navbar />
        <DashboardSection />
        <JobApplicationForm />
        <Footer />
      </>
    </div>
  );
}
