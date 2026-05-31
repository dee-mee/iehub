import type { ReactNode } from 'react'
import { MemberTopBar } from './MemberTopBar'

type Props = {
  title?: string
  children: ReactNode
  actions?: ReactNode
}

export function MemberPageShell({ title, children, actions }: Props) {
  return (
    <>
      <MemberTopBar title={title} />
      <div className="p-4 sm:p-6 lg:p-8 transition-colors">
        {(title || actions) && (
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            {title && (
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white sm:hidden tracking-tight">
                {title}
              </h2>
            )}
            {actions}
          </div>
        )}
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </div>
    </>
  )
}
