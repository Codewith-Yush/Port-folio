const words = ["Ayush", "Singh"];

export function AnimatedHeroName() {
  return (
    <h1
      className="hero-name w-fit max-w-full text-balance text-[clamp(3.5rem,12.5vw,5.6rem)] font-black leading-[0.9] text-[var(--ink)] sm:text-[clamp(4.5rem,8vw,7.5rem)]"
      aria-label="Ayush Singh"
    >
      {words.map((word, wordIndex) => (
        <span key={word} className="hero-name__word" aria-hidden="true">
          {word.split("").map((letter, letterIndex) => (
            <span
              key={`${word}-${letterIndex}`}
              className="hero-name__letter"
              style={{
                animationDelay: `${wordIndex * 220 + letterIndex * 42}ms`,
              }}
            >
              {letter}
            </span>
          ))}
        </span>
      ))}
    </h1>
  );
}
