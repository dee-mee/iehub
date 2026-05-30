import { Link } from 'react-router-dom'
import type { Resource } from '@/types/content'

const typeLabels: Record<Resource['resourceType'], string> = {
  REPORT: 'Report',
  PUBLICATION: 'Publication',
  TOOLKIT: 'Toolkit',
  POLICY_BRIEF: 'Policy brief',
  RESEARCH: 'Research',
  VIDEO: 'Video',
  AUDIO: 'Audio',
  OTHER: 'Other',
}

interface ResourceCardProps {
  resource: Resource
}

export function ResourceCard({ resource }: ResourceCardProps) {
  return (
    <article className="card flex h-full flex-col">
      <div className="flex justify-between items-start">
        <p className="text-xs font-semibold uppercase tracking-wide text-primary-600">
          {typeLabels[resource.resourceType]}
        </p>
        {resource.accessLevel === 'MEMBERS_ONLY' && (
          <span className="flex items-center gap-1 text-[10px] font-bold text-accent-700 bg-accent-50 px-2 py-0.5 rounded uppercase">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            Members
          </span>
        )}
      </div>
      <h3 className="mt-2 text-lg font-bold text-ink">
        <Link
          to={`/resources/${resource.id}`}
          className="hover:text-primary-700 focus-visible:rounded"
        >
          {resource.title}
        </Link>
      </h3>
      <p className="mt-2 flex-1 text-sm text-muted line-clamp-3">{resource.description}</p>
      <dl className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
        <div>
          <dt className="sr-only">Language</dt>
          <dd>{resource.language}</dd>
        </div>
        <div>
          <dt className="sr-only">Downloads</dt>
          <dd>{resource.downloadCount} downloads</dd>
        </div>
      </dl>
      <Link
        to={`/resources/${resource.id}`}
        className="btn-secondary mt-4 w-full text-center text-sm"
      >
        View resource
      </Link>
    </article>
  )
}
