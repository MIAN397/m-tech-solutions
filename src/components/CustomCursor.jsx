import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CustomCursor() {
  const [cursorState, setCursorState] = useState('default');
  const [cursorText, setCursorText] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(true);

  // Position coordinates
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Smooth springs for tracking
  const springConfig = { damping: 30, stiffness: 350, mass: 0.5 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Check if hover is supported (e.g., desktop vs mobile)
    const mediaQuery = window.matchMedia('(hover: hover)');
    setIsMobile(!mediaQuery.matches);

    const handleMediaChange = (e) => {
      setIsMobile(!e.matches);
    };
    mediaQuery.addEventListener('change', handleMediaChange);

    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    // Event delegation for dynamic cursor states
    const handleMouseOver = (e) => {
      const target = e.target.closest('[data-cursor]');
      if (target) {
        const state = target.getAttribute('data-cursor');
        const text = target.getAttribute('data-cursor-text') || '';
        setCursorState(state);
        setCursorText(text);
      } else {
        setCursorState('default');
        setCursorText('');
      }
    };

    document.addEventListener('mouseover', handleMouseOver);

    return () => {
      mediaQuery.removeEventListener('change', handleMediaChange);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseover', handleMouseOver);
    };
  }, [mouseX, mouseY, isVisible]);

  // Disable on mobile/touch interfaces
  if (isMobile || !isVisible) return null;

  // Define size, background, and text modifications based on active state
  const variants = {
    default: {
      width: 10,
      height: 10,
      backgroundColor: 'var(--cursor-dot-bg)',
      border: '0px solid transparent',
      borderRadius: '50%',
    },
    magnetic: {
      width: 80,
      height: 80,
      backgroundColor: 'var(--cursor-magnetic-bg)',
      border: '0px solid transparent',
      mixBlendMode: 'difference',
      borderRadius: '50%',
    },
    view: {
      width: 90,
      height: 90,
      backgroundColor: 'var(--cursor-view-bg)',
      border: '0px solid transparent',
      borderRadius: '50%',
    },
    footer: {
      width: 120,
      height: 120,
      backgroundColor: 'var(--cursor-footer-bg)',
      border: '0px solid transparent',
      mixBlendMode: 'difference',
      borderRadius: '50%',
    }
  };

  const ringVariants = {
    default: {
      width: 40,
      height: 40,
      border: '1px solid var(--cursor-ring-color)',
      backgroundColor: 'transparent',
      borderRadius: '50%',
    },
    magnetic: {
      width: 0,
      height: 0,
      border: '0px solid transparent',
      backgroundColor: 'transparent',
    },
    view: {
      width: 0,
      height: 0,
      border: '0px solid transparent',
      backgroundColor: 'transparent',
    },
    footer: {
      width: 0,
      height: 0,
      border: '0px solid transparent',
      backgroundColor: 'transparent',
    }
  };

  return (
    <>
      {/* Outer Spring Ring */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2 hidden md:block"
        style={{
          x: cursorX,
          y: cursorY,
        }}
        animate={cursorState}
        variants={ringVariants}
        transition={{ duration: 0.1, ease: 'easeOut' }}
      />

      {/* Inner Spring Dot / Morphing Body */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center text-center overflow-hidden hidden md:block"
        style={{
          x: cursorX,
          y: cursorY,
        }}
        animate={cursorState}
        variants={variants}
        transition={{ duration: 0.2, ease: 'easeOut' }}
      >
        {cursorState === 'view' && cursorText && (
          <motion.span
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.05 }}
            className="text-white font-display text-[10px] font-bold tracking-widest uppercase select-none"
          >
            {cursorText}
          </motion.span>
        )}
      </motion.div>
    </>
  );
}
