import { FC, memo, useLayoutEffect, useRef, useState } from 'react';
import { ReactComponent as WingIcon } from '../../angel-wing-icon.svg';

type CardP = {
  title?: string
  description?: string,
  imgSrc?: string,
  years?: string,
  militaryRank?: string,
  unit?: string,
  dateOfDeath?: string,
  circumstances?: string,
  awards?: string,
  victimType?: string
};

const Card: FC<CardP> = ({
  title = '',
  description = '',
  imgSrc = '',
  years = '',
  militaryRank = '',
  unit = '',
  dateOfDeath = '',
  circumstances = '',
  awards = '',
  victimType = ''
}) => {
  // Split full name into first and last lines
  const [firstName, ...restParts] = title.trim().split(/\s+/);
  const lastName = restParts.join(' ');
  const firstLetter = firstName?.charAt(0) ?? '';
  const restOfFirst = firstName?.slice(1) ?? '';

  // Refs to measure first-letter position
  const containerRef = useRef<HTMLDivElement | null>(null);
  const firstLetterRef = useRef<HTMLSpanElement | null>(null);
  const [iconPos, setIconPos] = useState<{ left: number; top: number; ready: boolean }>({ left: 0, top: 0, ready: false });

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
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#2f2e2e] to-[#252424] text-white shadow-2xl h-auto min-h-[600px] md:min-h-[500px]">
      {/* Main content - responsive layout */}
      <div className="relative z-10 flex flex-col md:flex-row h-full">
        {/* Image section - full width on mobile, left side on desktop */}
        <div className="flex justify-center md:justify-end items-end w-full md:w-auto md:max-w-[250px] p-4 md:p-6">
          {!!imgSrc && (
            <img
              alt={title}
              src={imgSrc}
              className="w-full max-w-[200px] md:max-w-[220px] h-auto object-contain select-none drop-shadow-[0_0px_15px_rgba(255,255,255,0.25)] grayscale transition-all duration-300 hover:grayscale-0 hover:drop-shadow-[0_0px_25px_rgba(255,255,255,0.5)]"
            />
          )}
        </div>

        {/* Content section */}
        <div className="flex-1 flex flex-col justify-center p-6 md:p-8 space-y-4 md:space-y-5">

          {/* Name with wing icon */}
          <div ref={containerRef} className="relative">
            <WingIcon
              aria-hidden
              className="absolute h-5 w-8 md:h-6 md:w-10 fill-gray-300 pointer-events-none select-none opacity-60"
              style={{
                left: iconPos.left,
                top: iconPos.top,
                transform: 'translate(-50%, -120%)',
                opacity: iconPos.ready ? 0.6 : 0,
              }}
            />
            {!!firstName && (
              <h2 className="font-baltica text-2xl md:text-3xl lg:text-4xl leading-tight font-normal text-white mb-2">
                <span className="block">
                  <span ref={firstLetterRef} className="inline-block align-baseline">{firstLetter}</span>
                  {restOfFirst}
                </span>
                {!!lastName && <span className="block">{lastName}</span>}
              </h2>
            )}
          </div>

          {/* Years */}
          {!!years && (
            <p className="text-gray-300 text-lg md:text-xl font-gilroy font-medium">{years}</p>
          )}

          {/* Description */}
          {!!description && (
            <div className="bg-black/20 rounded-lg p-3 md:p-4 border-l-4 border-gray-400">
              <p className="italic text-gray-100 text-sm md:text-base font-gilroy leading-relaxed">{description}</p>
            </div>
          )}

          {/* Information Grid - responsive */}
          <div className="grid grid-cols-1 gap-3 md:gap-4 mt-4">

            {/* Military Information Section */}
            {(militaryRank || unit) && (
              <div className="bg-gray-500/10 rounded-lg p-3 md:p-4 border border-gray-500/20">
                <h3 className="text-gray-300 font-gilroy font-semibold text-xs md:text-sm uppercase tracking-wide mb-2">Служба</h3>
                <div className="space-y-1 md:space-y-2">
                  {!!militaryRank && (
                    <p className="text-white font-gilroy text-sm md:text-base font-medium">{militaryRank}</p>
                  )}
                  {!!unit && (
                    <p className="text-gray-200 font-gilroy text-xs md:text-sm leading-relaxed">{unit}</p>
                  )}
                </div>
              </div>
            )}

            {/* Death Information Section */}
            {(dateOfDeath || circumstances) && (
              <div className="bg-gray-600/10 rounded-lg p-3 md:p-4 border border-gray-600/20">
                <h3 className="text-gray-300 font-gilroy font-semibold text-xs md:text-sm uppercase tracking-wide mb-2">Пам'ять</h3>
                <div className="space-y-1 md:space-y-2">
                  {!!dateOfDeath && (
                    <p className="text-gray-200 font-gilroy text-sm md:text-base font-medium">{dateOfDeath}</p>
                  )}
                  {!!circumstances && (
                    <p className="text-gray-200 font-gilroy text-xs md:text-sm leading-relaxed">{circumstances}</p>
                  )}
                </div>
              </div>
            )}

            {/* Awards Section */}
            {!!awards && (
              <div className="bg-gray-500/10 rounded-lg p-3 md:p-4 border border-gray-500/20">
                <h3 className="text-gray-300 font-gilroy font-semibold text-xs md:text-sm uppercase tracking-wide mb-2">Нагороди</h3>
                <p className="text-gray-200 font-gilroy text-xs md:text-sm leading-relaxed">{awards}</p>
              </div>
            )}



          </div>
        </div>
      </div>
    </div>
  )
};

export default memo(Card);
