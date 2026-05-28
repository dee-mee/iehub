import { Link, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { PageHeader } from '@/components/ui/PageHeader'
import { fetchNewsBySlug } from '@/api/public'
import { newsArticles as fallbackNews } from '@/data/mockContent'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

export function NewsDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const articleQuery = useQuery({
    queryKey: ['news', slug],
    queryFn: () => fetchNewsBySlug(slug ?? ''),
    enabled: Boolean(slug),
  })
  const article = articleQuery.data ?? fallbackNews.find((a) => a.slug === slug)

  if (articleQuery.isLoading) {
    return <LoadingSpinner label="Loading article" />
  }

  if (!article) {
    return (
      <div className="container-page py-16">
        <h1 className="section-heading">Article not found</h1>
        <Link to="/news" className="btn-primary mt-6 inline-flex">
          Back to news
        </Link>
      </div>
    )
  }

  const date = new Date(article.publishedAt).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <>
      <PageHeader title={article.title} description={article.excerpt} />
      <article className="container-page max-w-3xl py-12">
        <p className="text-sm text-muted">
          <time dateTime={article.publishedAt}>{date}</time> · {article.author}
        </p>
        <div className="prose mt-8 max-w-none text-muted">
          <p>{article.content}</p>
        </div>
        <Link to="/news" className="mt-8 inline-block text-sm font-semibold text-primary-600 hover:underline">
          ← All news
        </Link>
        {articleQuery.isError && (
          <p className="mt-4 text-sm text-red-700" role="status">
            API article could not be loaded; fallback content shown.
          </p>
        )}
      </article>
    </>
  )
}
