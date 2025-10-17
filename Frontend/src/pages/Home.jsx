import Navbar from "../components/custom/Navbar.jsx";
import Hero from "../Sections/Hero.jsx";
import Doctors from "../components/custom/DoctorCard.jsx";
import Reviews from "../Sections/Reviews.jsx";
import FAQs from "../Sections/FAQs.jsx";
import Footer from "../components/custom/Footer.jsx";

export default function Home() {
  return (
    <div className="font-sans">
      
      <Hero />
      <Doctors />
      <Reviews />
      <FAQs />
    </div>
  );
}
