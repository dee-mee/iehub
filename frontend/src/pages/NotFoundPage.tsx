import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <div className="container-page py-24 text-center">
      <h1 className="text-6xl font-bold text-primary-600">404</h1>
      <p className="mt-4 text-xl text-muted">Page not found</p>
      <Link to="/" className="btn-primary mt-8 inline-flex">
        Go to home page
      </Link>
    </div>
  )
}
