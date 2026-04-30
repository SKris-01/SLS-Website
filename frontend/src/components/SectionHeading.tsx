interface SectionHeadingProps {
  title: string
  subtitle?: string
}

const SectionHeading = ({ title, subtitle }: SectionHeadingProps) => {
  if (!title && !subtitle) return null

  return (
    <div className="mb-4 md:mb-12 text-left px-2 md:px-0">
      {title && (
        <h2 className="text-xl sm:text-3xl font-black text-brand-dark uppercase tracking-tight px-2 whitespace-nowrap inline-block">
          {title}
        </h2>
      )}
      {subtitle && (
        <p className="mt-4 md:mt-8 text-white/30 font-bold uppercase text-[10px] tracking-[0.4em] font-syne ml-4 max-w-lg">
          {subtitle}
        </p>
      )}
    </div>
  )
}

export default SectionHeading
