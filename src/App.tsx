import Hero from "./components/Hero";
import Navbar from "./components/Navbar";
import ProductViewer from "./components/ProductViewer";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";

gsap.registerPlugin(ScrollTrigger);

const App = () => {
  return (
    <>
      <Navbar />
      <Hero />
      <ProductViewer />
    </>
  );
}

export default App;