interface PageHeaderProps {
  title: string
  description?: string
  children?: React.ReactNode
}

export function PageHeader({ title, description, children }: PageHeaderProps) {
  return (
    <div className="bg-primary-800 text-white">
      <div className="container-page py-12 md:py-16">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">{title}</h1>
        {description && (
          <p className="mt-4 max-w-3xl text-lg text-primary-100">{description}</p>
        )}
        {children && <div className="mt-6">{children}</div>}
      </div>
    </div>
  )
}
