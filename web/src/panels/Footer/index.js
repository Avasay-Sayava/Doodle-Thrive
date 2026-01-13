import "./style.css";
import { useEffect, useMemo, useState } from "react";

const SLOGANS = [
  "Doodle Drive: Why use the best when you can use the rest?",
  "Doodle Drive: 10% of the features, 100% of the bags.",
  "Doodle Drive: Because Google is too reliable.",
  "Doodle Drive: It's not a bug, it's a sketch.",
  "Doodle Drive: Lower your expectations.",
  "Doodle Drive: Strictly for files you don't need.",
  "Doodle Drive: When you have literally no other options.",
  "Doodle Drive: Your files are safe... probably.",
  "Doodle Drive: We don't have a \"Delete\" button because the site does it for you.",
  "Doodle Drive: It's better than writing it on a napkin.",
  "Doodle Drive: We tried our least.",
  "Doodle Drive: Your privacy is our second-to-last priority.",
  "Doodle Drive: We sell your data to the US of A."
];

export default function Footer() {
  const [index, setIndex] = useState(() => Math.floor(Math.random() * SLOGANS.length));
  const slogan = useMemo(() => SLOGANS[index], [index]);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % SLOGANS.length);
    }, 10000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="app-footer-content" role="contentinfo" aria-live="polite">
      <span className="footer-text">{slogan}</span>
    </div>
  );
}
