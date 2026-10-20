import { profile } from '../data';
import { useToast } from '../context/ToastContext';

export default function Footer() {
  const toast = useToast();

  // Opens the phone's share sheet when available; otherwise copies the link.
  const share = async () => {
    const data = { title: `${profile.name} · Portfolio`, text: 'Have a look at this portfolio.', url: window.location.href.split('#')[0] };
    try {
      if (typeof navigator.share === 'function') await navigator.share(data);
      else { await navigator.clipboard.writeText(data.url); toast('Link copied'); }
    } catch (err) {
      if (!(err instanceof DOMException && err.name === 'AbortError')) toast('Could not share. Copy the address from the browser bar.');
    }
  };

  return (
    <footer className="relative pt-5 pb-[calc(60px+env(safe-area-inset-bottom,0px))] text-center text-[.85rem] text-muted">
      <div className="wrap pt-[clamp(56px,9vw,90px)] pb-[30px] text-center">
        <h2 className="mx-auto mb-[26px] max-w-none text-[clamp(2rem,1rem+4.4vw,4.5rem)] font-extrabold text-ink">
          Let's stay <span className="text-grad-anim animate-sheen">connected</span>.
        </h2>
        <a className="inline-block border-b-2 border-accent2 pb-1 font-display text-[clamp(1rem,.7rem+1.4vw,1.75rem)] font-bold no-underline [overflow-wrap:anywhere]" href={`mailto:${profile.email}`}>{profile.email}</a>
        <div className="mt-[34px] flex flex-wrap items-center justify-center gap-x-6 gap-y-3 print:hidden">
          <a className="text-[.85rem] text-muted no-underline hover:text-ink" href="#top">Back to top ↑</a>
          <button type="button" onClick={share} className="cursor-pointer text-[.85rem] text-muted hover:text-ink">Share this site ↗</button>
        </div>
      </div>
      © {new Date().getFullYear()} {profile.name} · {profile.location}, India
    </footer>
  );
}
