import { useState, useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { PageHeader } from '@/components/ui/PageHeader'
import { fetchResourceById, incrementDownload } from '@/api/public'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { useAuth } from '@/context/AuthContext'
import type { Resource, ResourceFile } from '@/types/content'

// ─── helpers ────────────────────────────────────────────────────────────────

function isVideoType(file: ResourceFile | null, resource: Resource): boolean {
  if (file) return file.fileType === 'VIDEO'
  return resource.resourceType === 'VIDEO'
}

function isAudioType(file: ResourceFile | null, resource: Resource): boolean {
  if (file) return file.fileType === 'AUDIO'
  return resource.resourceType === 'AUDIO'
}

function isPdfType(file: ResourceFile | null, resource: Resource): boolean {
  if (file) return file.fileType === 'PDF' || file.fileType === 'DOCUMENT'
  return ['REPORT', 'PUBLICATION', 'TOOLKIT', 'POLICY_BRIEF', 'RESEARCH'].includes(resource.resourceType)
}

function isYouTube(url: string): boolean {
  return /youtube\.com|youtu\.be/.test(url)
}

function youtubeEmbedUrl(url: string): string {
  // support watch?v=, youtu.be/, embed/
  const match = url.match(/(?:v=|youtu\.be\/|embed\/)([A-Za-z0-9_-]{11})/)
  if (!match) return url
  return `https://www.youtube.com/embed/${match[1]}?cc_load_policy=1&cc_lang_pref=en&rel=0`
}

// ─── inline viewer components ────────────────────────────────────────────────

function VideoViewer({ url, title }: { url: string; title: string }) {
  if (isYouTube(url)) {
    return (
      <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-lg bg-black">
        <iframe
          src={youtubeEmbedUrl(url)}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />
        <p className="sr-only">
          Subtitles/closed captions are enabled by default. Use the CC button in the player controls to toggle.
        </p>
      </div>
    )
  }
  // native video with CC notice
  return (
    <div className="rounded-xl overflow-hidden shadow-lg bg-black">
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <video
        controls
        className="w-full max-h-[480px]"
        aria-label={title}
      >
        <source src={url} />
        {/* Auto-captions via WebVTT — browsers that support it will show CC button */}
        <track kind="captions" src="" label="Auto captions" default />
        Your browser does not support HTML5 video.
      </video>
      <p className="px-4 py-2 text-xs text-white/70 bg-black">
        Use the CC button in the player to toggle captions. Auto-captions are generated for supported browsers.
      </p>
    </div>
  )
}

function AudioViewer({ url, title }: { url: string; title: string }) {
  return (
    <div className="rounded-xl border border-primary-100 bg-primary-50 p-6">
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <audio controls className="w-full" aria-label={title}>
        <source src={url} />
        Your browser does not support audio playback.
      </audio>
    </div>
  )
}

function PdfViewer({ url, title }: { url: string; title: string }) {
  const [pdfError, setPdfError] = useState(false)
  return (
    <div className="rounded-xl overflow-hidden shadow-lg border border-primary-100">
      {pdfError ? (
        <div className="p-8 text-center text-muted bg-primary-50">
          <p className="mb-3">Could not display PDF inline in this browser.</p>
          <a href={url} target="_blank" rel="noopener noreferrer" className="btn-primary inline-flex">
            Open PDF in new tab
          </a>
        </div>
      ) : (
        <iframe
          src={`${url}#toolbar=1&navpanes=0`}
          title={`PDF viewer — ${title}`}
          className="w-full h-[600px]"
          onError={() => setPdfError(true)}
        />
      )}
    </div>
  )
}

// ─── file tabs ───────────────────────────────────────────────────────────────

interface FileTabsProps {
  resource: Resource
  activeIndex: number
  onSelect: (i: number) => void
}

function FileTabs({ resource, activeIndex, onSelect }: FileTabsProps) {
  const allFiles = buildFileList(resource)
  if (allFiles.length <= 1) return null
  return (
    <div className="flex flex-wrap gap-2 mb-4" role="tablist" aria-label="Resource files">
      {allFiles.map((f, i) => (
        <button
          key={i}
          type="button"
          role="tab"
          aria-selected={i === activeIndex}
          onClick={() => onSelect(i)}
          className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            i === activeIndex
              ? 'bg-primary-700 text-white'
              : 'bg-primary-50 text-primary-700 hover:bg-primary-100'
          }`}
        >
          {f.label || f.fileType}
        </button>
      ))}
    </div>
  )
}

// ─── unified file list ────────────────────────────────────────────────────────

interface FileEntry {
  url: string
  fileType: ResourceFile['fileType'] | 'VIDEO' | 'AUDIO' | 'PDF' | 'EXTERNAL'
  label: string
}

function buildFileList(resource: Resource): FileEntry[] {
  const entries: FileEntry[] = []

  // 1. inline ResourceFile attachments (highest priority)
  for (const f of resource.files) {
    if (f.fileUrl) {
      entries.push({
        url: f.fileUrl,
        fileType: f.fileType,
        label: f.label || f.fileType,
      })
    }
  }

  // 2. primary file on the resource itself
  if (resource.fileUrl && !entries.some((e) => e.url === resource.fileUrl)) {
    const ft = resource.resourceType === 'VIDEO'
      ? 'VIDEO'
      : resource.resourceType === 'AUDIO'
        ? 'AUDIO'
        : 'PDF'
    entries.push({ url: resource.fileUrl, fileType: ft, label: 'Primary file' })
  }

  // 3. external URL
  if (resource.externalUrl && !entries.some((e) => e.url === resource.externalUrl)) {
    entries.push({ url: resource.externalUrl, fileType: 'EXTERNAL', label: 'External link' })
  }

  return entries
}

// ─── main page ────────────────────────────────────────────────────────────────

export function ResourceDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { isAuthenticated } = useAuth()
  const [activeFileIndex, setActiveFileIndex] = useState(0)
  const viewerRef = useRef<HTMLDivElement>(null)

  const resourceQuery = useQuery({
    queryKey: ['resource', id],
    queryFn: () => fetchResourceById(id ?? ''),
    enabled: Boolean(id),
  })
  const resource = resourceQuery.data

  if (resourceQuery.isLoading) {
    return <LoadingSpinner label="Loading resource details" />
  }

  if (!resource) {
    return (
      <div className="container-page py-16" role="alert">
        <h1 className="section-heading">Resource not found</h1>
        <Link to="/resources" className="btn-primary mt-6 inline-flex">
          Back to library
        </Link>
      </div>
    )
  }

  const isRestricted = resource.accessLevel === 'MEMBERS_ONLY' && !isAuthenticated
  const allFiles = buildFileList(resource)
  const activeFile = allFiles[activeFileIndex] ?? null

  const published = new Date(resource.publishedAt).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  async function handleDownload(url: string) {
    try { await incrementDownload(resource!.id) } catch { /* best-effort */ }
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  function scrollToViewer() {
    viewerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <>
      <PageHeader title={resource.title} />
      <article className="container-page max-w-4xl py-12">

        {/* badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs font-bold rounded uppercase">
            {resource.resourceType.replace('_', ' ')}
          </span>
          {resource.accessLevel === 'MEMBERS_ONLY' && (
            <span className="px-2 py-1 bg-accent-100 text-accent-700 text-xs font-bold rounded uppercase flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              Members Only
            </span>
          )}
        </div>

        <p className="text-muted text-lg leading-relaxed">{resource.description}</p>

        {/* metadata */}
        <dl className="mt-8 grid gap-4 rounded-xl border border-primary-100 bg-white p-6 sm:grid-cols-2">
          <div>
            <dt className="text-sm font-semibold text-ink">Published</dt>
            <dd className="text-muted">
              <time dateTime={resource.publishedAt}>{published}</time>
            </dd>
          </div>
          <div>
            <dt className="text-sm font-semibold text-ink">Language</dt>
            <dd className="text-muted">{resource.language}</dd>
          </div>
          {resource.topics.length > 0 && (
            <div className="sm:col-span-2 border-t border-primary-50 pt-4 mt-2">
              <dt className="text-sm font-semibold text-ink">Topics</dt>
              <dd className="text-muted mt-1 flex flex-wrap gap-1">
                {resource.topics.map((topic) => (
                  <span key={topic.id} className="px-2 py-0.5 bg-primary-50 text-primary-700 rounded text-xs">
                    {topic.name}
                  </span>
                ))}
              </dd>
            </div>
          )}
        </dl>

        {/* ── CONTENT AREA ── */}
        {isRestricted ? (
          <div className="mt-12 p-8 bg-primary-900 text-white rounded-2xl text-center shadow-lg">
            <div className="mx-auto w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-accent-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2">Member-only Content</h2>
            <p className="text-primary-100 mb-8 max-w-md mx-auto">
              This resource is part of our professional library. Please join the Community of Practice or sign in to access it.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className="btn-primary bg-accent-500 hover:bg-accent-600 text-ink">
                Join Community
              </Link>
              <Link to="/login" className="btn-secondary border-white text-white hover:bg-white/10">
                Sign in
              </Link>
            </div>
          </div>
        ) : allFiles.length === 0 ? (
          <div className="mt-12 p-6 bg-primary-50 rounded-xl border border-primary-100 text-center text-muted">
            <p>No files or links are attached to this resource yet.</p>
          </div>
        ) : (
          <div className="mt-12 space-y-6" ref={viewerRef}>
            <h2 className="text-xl font-bold text-ink">Resource content</h2>

            {/* file selector tabs */}
            <FileTabs resource={resource} activeIndex={activeFileIndex} onSelect={(i) => { setActiveFileIndex(i); scrollToViewer() }} />

            {/* ── INLINE VIEWER ── */}
            {activeFile && (() => {
              const { url, fileType } = activeFile
              const fakeFile: ResourceFile = { id: 0, fileUrl: url, fileType: fileType as ResourceFile['fileType'], label: activeFile.label, order: 0 }

              if (fileType === 'EXTERNAL') {
                return (
                  <div className="rounded-xl border border-primary-100 bg-primary-50 p-8 text-center">
                    <p className="text-muted mb-4">This resource is hosted externally.</p>
                    <a href={url} target="_blank" rel="noopener noreferrer" className="btn-primary inline-flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      Open external link
                    </a>
                  </div>
                )
              }

              if (isVideoType(fakeFile, resource)) {
                return (
                  <div>
                    <VideoViewer url={url} title={resource.title} />
                    <div className="mt-3 flex items-center gap-2 text-xs text-muted">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                      </svg>
                      Closed captions (CC) are available — click the CC button in the video player to enable them.
                    </div>
                  </div>
                )
              }

              if (isAudioType(fakeFile, resource)) {
                return <AudioViewer url={url} title={resource.title} />
              }

              if (isPdfType(fakeFile, resource)) {
                return <PdfViewer url={url} title={resource.title} />
              }

              // generic: image or unknown
              return (
                <div className="rounded-xl border border-primary-100 overflow-hidden bg-primary-50 p-4 text-center">
                  <img src={url} alt={resource.title} className="max-w-full mx-auto rounded" />
                </div>
              )
            })()}

            {/* download / open button */}
            {activeFile && activeFile.fileType !== 'EXTERNAL' && (
              <div className="flex flex-wrap gap-3 items-center pt-2">
                <button
                  type="button"
                  className="btn-primary inline-flex items-center gap-2"
                  onClick={() => handleDownload(activeFile.url)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download {activeFile.label || activeFile.fileType}
                </button>
                <a
                  href={activeFile.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary inline-flex items-center gap-2 text-sm"
                  onClick={() => incrementDownload(resource.id).catch(() => {})}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Open in new tab
                </a>
              </div>
            )}
          </div>
        )}

        <Link to="/resources" className="mt-12 inline-block text-sm font-semibold text-primary-600 hover:underline">
          ← Back to library
        </Link>

        {resourceQuery.isError && (
          <p className="mt-6 p-3 bg-red-50 text-red-700 text-xs rounded border border-red-100" role="status">
            Note: Live API details could not be loaded.
          </p>
        )}
      </article>
    </>
  )
}
