interface PageHeaderProps {
  badge: string;
  title: string;
  description: string;
}

export default function PageHeader({
  badge,
  title,
  description,
}: PageHeaderProps) {
  return (
    <section className="relative overflow-hidden border-b border-neutral-800 bg-gradient-to-br from-[#090909] via-[#170e0b] to-[#2b1209] py-16 text-white sm:py-20">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[#ff491a]/25 blur-3xl"
      />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <span className="inline-block rounded-full border border-[#ff491a]/40 bg-[#ff491a]/15 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-[#ffc3b3]">
          {badge}
        </span>
        <h1 className="mt-4 text-3xl font-black tracking-tight sm:text-5xl">
          {title}
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-neutral-300 sm:text-base">
          {description}
        </p>
      </div>
    </section>
  );
}
