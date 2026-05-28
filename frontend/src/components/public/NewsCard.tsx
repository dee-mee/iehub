import { Link } from 'react-router-dom'
import type { NewsArticle } from '@/types/content'

interface NewsCardProps {
  article: NewsArticle
}

export function NewsCard({ article }: NewsCardProps) {
  const date = new Date(article.publishedAt).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <article className="card">
      <p className="text-xs font-semibold uppercase text-primary-600">{article.category}</p>
      <h3 className="mt-2 text-lg font-bold">
        <Link to={`/news/${article.slug}`} className="hover:text-primary-700">
          {article.title}
        </Link>
      </h3>
      <p className="mt-2 text-sm text-muted">{article.excerpt}</p>
      <footer className="mt-4 flex items-center justify-between text-xs text-muted">
        <time dateTime={article.publishedAt}>{date}</time>
        <span>{article.author}</span>
      </footer>
    </article>
  )
}
