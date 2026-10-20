import { useCallback, useState } from 'react';
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
import BackToTop from './components/BackToTop';
import CommandPalette from './components/CommandPalette';

export default function App() {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const closePalette = useCallback(() => setPaletteOpen(false), []);
  const openPalette = useCallback(() => setPaletteOpen(true), []);
  const togglePalette = useCallback(() => setPaletteOpen((o) => !o), []);

  return (
    <>
      <a className="fixed -left-[9999px] top-2 z-[100] rounded-[10px] bg-accent px-4 py-2.5 text-white no-underline focus:left-3" href="#top">Skip to content</a>
      <ScrollProgress />
      <Nav onOpenPalette={openPalette} />
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
      <BackToTop />
      <CommandPalette open={paletteOpen} onClose={closePalette} onToggle={togglePalette} />
    </>
  );
}
