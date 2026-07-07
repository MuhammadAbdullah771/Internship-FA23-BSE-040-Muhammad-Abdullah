import { useEffect, useRef, useState } from 'react';
import { useInView, animate } from 'framer-motion';

function parseStatValue(raw) {
  const match = String(raw).match(/^([\d.]+)(.*)$/);
  if (!match) return { num: 0, suffix: raw, decimals: 0 };
  const num = parseFloat(match[1]);
  const decimals = match[1].includes('.') ? match[1].split('.')[1].length : 0;
  return { num, suffix: match[2], decimals };
}

export default function AnimatedCounter({ value, className }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  const [display, setDisplay] = useState('0');
  const { num, suffix, decimals } = parseStatValue(value);

  useEffect(() => {
    if (!isInView) return undefined;

    const controls = animate(0, num, {
      duration: 1.8,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => {
        setDisplay(decimals > 0 ? v.toFixed(decimals) : Math.round(v).toString());
      },
    });

    return () => controls.stop();
  }, [isInView, num, decimals]);

  return (
    <span ref={ref} className={className}>
      {display}{suffix}
    </span>
  );
}
