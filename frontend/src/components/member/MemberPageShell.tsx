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
      <div className="member-content">
        {(title || actions) && (
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            {title && <h2 className="text-2xl font-bold text-gray-900 sm:hidden">{title}</h2>}
            {actions}
          </div>
        )}
        {children}
      </div>
    </>
  )
}
