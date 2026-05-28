import { Link } from 'react-router-dom'
import type { Resource } from '@/types/content'

const typeLabels: Record<Resource['resourceType'], string> = {
  REPORT: 'Report',
  PUBLICATION: 'Publication',
  TOOLKIT: 'Toolkit',
  POLICY_BRIEF: 'Policy brief',
  RESEARCH: 'Research',
  VIDEO: 'Video',
  OTHER: 'Other',
}

interface ResourceCardProps {
  resource: Resource
}

export function ResourceCard({ resource }: ResourceCardProps) {
  return (
    <article className="card flex h-full flex-col">
      <p className="text-xs font-semibold uppercase tracking-wide text-primary-600">
        {typeLabels[resource.resourceType]}
      </p>
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
