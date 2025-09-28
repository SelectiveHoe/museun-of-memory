import { FC, memo, useLayoutEffect, useRef, useState } from 'react';
import { ReactComponent as WingIcon } from '../../angel-wing-icon.svg';

type CardP = {
  title?: string
  description?: string,
  imgSrc?: string,
  years?: string
};

const Card:FC<CardP> = ({title = '', description = '', imgSrc = '', years = ''}) => {
  // Split full name into first and last lines
  const [firstName, ...restParts] = title.trim().split(/\s+/);
  const lastName = restParts.join(' ');
  const firstLetter = firstName?.charAt(0) ?? '';
  const restOfFirst = firstName?.slice(1) ?? '';

  // Refs to measure first-letter position
  const containerRef = useRef<HTMLDivElement | null>(null);
  const firstLetterRef = useRef<HTMLSpanElement | null>(null);
  const [iconPos, setIconPos] = useState<{left:number; top:number; ready:boolean}>({left:0, top:0, ready:false});

  useLayoutEffect(() => {
    const measure = () => {
      const c = containerRef.current;
      const l = firstLetterRef.current;
      if (!c || !l) return;
      const cRect = c.getBoundingClientRect();
      const lRect = l.getBoundingClientRect();
      const left = lRect.left - cRect.left + lRect.width / 2;
      const top = lRect.top - cRect.top + lRect.height / 2;
      setIconPos({ left, top, ready: true });
    };

    // Measure now, after fonts load, and on resize
    const raf = requestAnimationFrame(measure);
    const onResize = () => measure();
    window.addEventListener('resize', onResize);
    // If the browser supports font loading API, re-measure after fonts settle
    // @ts-ignore
    if (document.fonts && typeof document.fonts.ready?.then === 'function') {
      // @ts-ignore
      document.fonts.ready.then(() => requestAnimationFrame(measure));
    }
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
    };
  }, [title]);

  return (
    <div className="relative overflow-hidden rounded-2xl bg-[#2A2520] text-white shadow-2xl h-[660px] md:h-[460px]">
      {/* Main content laid out in a row: image left, text right */}
      <div className="relative z-10 flex h-full items-stretch pl-8">
        {/* Image column: intrinsic width up to 200px, bottom-aligned */}
        <div className="flex h-full flex-col justify-end">
          {!!imgSrc && (
            <img
              alt={title}
              src={imgSrc}
              className="max-w-[300px] w-auto max-h-full object-contain select-none drop-shadow-[0_0px_20px_rgba(255,255,255,0.55)] grayscale"
            />
          )}
        </div>

        {/* Text column */}
        <div className="flex-1 flex flex-col justify-center items-start text-left pl-8 gap-3">
          {/* Wing icon positioned relative to the first letter center */}
          <div ref={containerRef} className="text-amber-400/95 relative inline-block pt-7 md:pt-9">
            <WingIcon
              aria-hidden
              className="absolute h-6 w-10 md:h-8 md:w-12 fill-current pointer-events-none select-none"
              style={{
                left: iconPos.left,
                top: iconPos.top,
                transform: 'translate(-51.5%, -140%)',
                opacity: iconPos.ready ? 1 : 0,
              }}
            />
            {!!firstName && (
              <h2 className="font-baltica text-[32px] leading-tight md:text-4xl md:leading-tight font-normal">
                <span className="block whitespace-nowrap">
                  <span ref={firstLetterRef} className="inline-block align-baseline">{firstLetter}</span>
                  {restOfFirst}
                </span>
                {!!lastName && <span className="block whitespace-nowrap">{lastName}</span>}
              </h2>
            )}
          </div>

          {!!years && (
            <p className="text-amber-300/90 text-xl md:text-2xl">{years}</p>
          )}

          {!!description && (
            <span className="italic text-gray-300/90 text-lg">{description}</span>
          )}
        </div>
      </div>
    </div>
  )
};

export default memo(Card);
