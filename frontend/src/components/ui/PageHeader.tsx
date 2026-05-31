interface PageHeaderProps {
  title: string
  description?: string
  children?: React.ReactNode
}

export function PageHeader({ title, description, children }: PageHeaderProps) {
  return (
    <div className="border-b-2 border-[#2d2d2d] bg-[#003d2e] text-white">
      <div className="container-page py-10 md:py-12">
        <div className="border-2 border-white/30 bg-[#003d2e] p-6 md:p-8">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#7dffc8] mb-2">
            IE Hub Africa
          </p>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl border-0 pl-0">
            {title}
          </h1>
          {description && (
            <p className="mt-4 max-w-3xl text-base text-white/90 border-t-2 border-white/20 pt-4">
              {description}
            </p>
          )}
          {children && <div className="mt-6 pt-4 border-t-2 border-white/20">{children}</div>}
        </div>
      </div>
    </div>
  )
}
