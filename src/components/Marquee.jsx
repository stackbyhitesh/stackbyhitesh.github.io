/** Endlessly scrolling row. Items are repeated twice so the loop is seamless. */
export default function Marquee({ items }) {
  return (
    <div className="mq">
      <div className="mqi">
        {[...items, ...items].map((item, i) => <span key={i}>{item}</span>)}
      </div>
    </div>
  );
}
