import { Link } from 'react-router-dom'
import type { NewsArticle } from '@/types/content'

interface NewsCardProps {
  article: NewsArticle
  variant?: 'light' | 'dark'
}

// Placeholder images per article id (swap with real thumbnails)
const placeholderImgs: Record<string, string> = {
  '1': 'https://images.unsplash.com/photo-1529390079861-591de354faf5?w=600&q=70',
  '2': 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&q=70',
  '3': 'https://images.unsplash.com/photo-1617802690658-1173a812650d?w=600&q=70',
}
const fallbackImg = 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&q=70'

export function NewsCard({ article }: NewsCardProps) {
  const date = new Date(article.publishedAt).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
  const img = placeholderImgs[article.id] ?? fallbackImg

  return (
    <article className="group relative overflow-hidden rounded-2xl shadow-sm hover:shadow-lg transition-shadow">
      {/* Image */}
      <div className="relative h-52 overflow-hidden">
        <img
          src={img}
          alt={article.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        {/* Category badge */}
        <span
          className="absolute top-3 left-3 rounded-full px-3 py-1 text-xs font-bold text-white"
          style={{ background: '#662d91' }}
        >
          {article.category}
        </span>
      </div>

      {/* Content overlay at bottom of image + below */}
      <div className="bg-[#00a170] px-5 py-4 text-white">
        <h3 className="text-base font-bold leading-snug group-hover:underline">
          <Link to={`/news/${article.slug}`} className="hover:opacity-90">
            {article.title}
          </Link>
        </h3>
        <p className="mt-1.5 text-sm text-white/80 line-clamp-2">{article.excerpt}</p>
        <footer className="mt-3 flex items-center justify-between text-xs text-white/60">
          <time dateTime={article.publishedAt}>{date}</time>
          <span>{article.author}</span>
        </footer>
      </div>
    </article>
  )
}
