import { useTranslation } from 'react-i18next'

export function SkipToContent() {
  const { t } = useTranslation()

  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-primary-700 focus:px-4 focus:py-3 focus:text-white"
    >
      {t('skipToContent')}
    </a>
  )
}
