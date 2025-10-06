import Navbar from "../components/custom/Navbar.jsx";
import Hero from "../components/custom/Hero.jsx";
import Doctors from "../components/custom/Doctors.jsx";
import Reviews from "../components/custom/Reviews.jsx";
import FAQs from "../components/custom/FAQs.jsx";
import Footer from "../components/custom/Footer.jsx";

export default function App() {
  return (
    <div className="font-sans">
      <Navbar />
      <Hero />
      <Doctors />
      <Reviews />
      <FAQs />
      <Footer />
    </div>
  );
}
