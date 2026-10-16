import ScrollProgress from './components/ScrollProgress';
import Nav from './components/Nav';
import Hero from './components/Hero';
import Trust from './components/Trust';
import About from './components/About';
import Experience from './components/Experience';
import Process from './components/Process';
import Projects from './components/Projects';
import Achievements from './components/Achievements';
import Testimonials from './components/Testimonials';
import Skills from './components/Skills';
import Education from './components/Education';
import Contact from './components/Contact';
import Footer from './components/Footer';

export default function App() {
  return (
    <>
      <a className="skip" href="#top">Skip to content</a>
      <ScrollProgress />
      <Nav />
      <main className="wrap" id="top">
        <Hero />
        <Trust />
        <About />
        <Experience />
        <Process />
        <Projects />
        <Achievements />
        <Testimonials />
        <Skills />
        <Education />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
