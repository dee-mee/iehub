import type { EventItem, FocusArea, ImpactStat, NewsArticle, Resource } from '@/types/content'

export const impactStats: ImpactStat[] = [
  {
    id: '1',
    value: '54',
    label: 'African countries',
    description: 'Continental reach for inclusive education practitioners',
  },
  {
    id: '2',
    value: '11',
    label: 'LM country offices',
    description: 'Regional hubs supporting local communities',
  },
  {
    id: '3',
    value: '13',
    label: 'Steering Committee partners',
    description: 'Organizations governing the platform',
  },
  {
    id: '4',
    value: '5',
    label: 'Languages',
    description: 'English, French, Arabic, Portuguese, and Swahili',
  },
]

export const heroStats = [
  {
    id: 'disability',
    headline: '16%',
    subline: 'of the world’s population lives with significant disability',
    detail: 'That is 1 in 6 people — inclusive education is essential for every learner.',
  },
  {
    id: 'school',
    headline: '90%',
    subline: 'of children with disabilities in developing countries do not attend school',
    detail: 'IE Hub connects practitioners working to close this gap.',
  },
  {
    id: 'poverty',
    headline: '40%',
    subline: 'of persons with disabilities live below the poverty line',
    detail: 'Policy, practice, and partnership must work together across Africa.',
  },
]

export const focusAreas: FocusArea[] = [
  {
    id: 'policy',
    title: 'Policy & Advocacy',
    description:
      'Evidence-based policy briefs and advocacy tools for governments and civil society.',
    href: '/resources?topic=policy-advocacy',
  },
  {
    id: 'training',
    title: 'Teacher Training',
    description:
      'Capacity building resources for inclusive pedagogy and classroom practice.',
    href: '/resources?topic=teacher-training',
  },
  {
    id: 'assistive',
    title: 'Assistive Technology',
    description:
      'Guidance on accessible learning materials and assistive devices in schools.',
    href: '/resources?topic=assistive-technology',
  },
  {
    id: 'research',
    title: 'Research & Evidence',
    description:
      'Research findings and data to inform inclusive education programming.',
    href: '/resources?topic=research-evidence',
  },
  {
    id: 'emergencies',
    title: 'Education in Emergencies',
    description:
      'Resources for inclusive education in conflict and humanitarian settings.',
    href: '/resources?topic=education-emergencies',
  },
  {
    id: 'early',
    title: 'Early Childhood',
    description:
      'Inclusive early childhood development and foundational learning.',
    href: '/resources?topic=early-childhood',
  },
]

export const resources: Resource[] = [
  {
    id: '1',
    title: 'Inclusive Education Policy Framework for Africa',
    description:
      'A continental reference for ministries developing inclusive education policies aligned with the UN CRPD.',
    resourceType: 'POLICY_BRIEF',
    accessLevel: 'PUBLIC',
    language: 'English',
    countries: ['Kenya', 'Uganda', 'Tanzania'],
    topics: [{ id: 1, name: 'Policy & Advocacy', slug: 'policy-advocacy' }],
    disabilityTypes: [],
    publishedAt: '2026-03-15',
    downloadCount: 342,
    isFeatured: true,
    fileUrl: null,
    externalUrl: '',
    thumbnailUrl: null,
    files: [],
  },
  {
    id: '2',
    title: 'Teacher Toolkit: Universal Design for Learning',
    description:
      'Practical classroom strategies for diverse learners, with case studies from East Africa.',
    resourceType: 'TOOLKIT',
    accessLevel: 'PUBLIC',
    language: 'English',
    countries: ['Kenya', 'Ethiopia'],
    topics: [{ id: 2, name: 'Teacher Training', slug: 'teacher-training' }],
    disabilityTypes: [{ id: 6, name: 'Learning Disabilities', slug: 'learning-disabilities' }],
    publishedAt: '2026-02-20',
    downloadCount: 518,
    isFeatured: true,
    fileUrl: null,
    externalUrl: '',
    thumbnailUrl: null,
    files: [],
  },
  {
    id: '3',
    title: 'Assistive Devices in Low-Resource Schools',
    description:
      'Guidance on procurement, maintenance, and training for assistive technology in schools.',
    resourceType: 'PUBLICATION',
    accessLevel: 'PUBLIC',
    language: 'French',
    countries: ['DRC', 'Chad'],
    topics: [{ id: 3, name: 'Assistive Technology', slug: 'assistive-technology' }],
    disabilityTypes: [
        { id: 1, name: 'Visual Impairment', slug: 'visual-impairment' },
        { id: 2, name: 'Hearing Impairment', slug: 'hearing-impairment' }
    ],
    publishedAt: '2026-01-10',
    downloadCount: 201,
    isFeatured: true,
    fileUrl: null,
    externalUrl: '',
    thumbnailUrl: null,
    files: [],
  },
]

export const newsArticles: NewsArticle[] = [
  {
    id: '1',
    slug: 'launch-day-african-child',
    title: 'IE Hub soft launch on Day of the African Child',
    excerpt:
      'Join practitioners across Africa as we open the public resource library and member registration.',
    content:
      'On 16 June 2026, IE Hub will launch its public website in celebration of the Day of the African Child, with resources, news, and pathways to join the Community of Practice.',
    category: 'NEWS',
    publishedAt: '2026-05-20',
    author: 'LM International',
  },
  {
    id: '2',
    slug: 'steering-committee-meeting',
    title: 'Steering Committee agrees platform governance model',
    excerpt:
      'Thirteen partner organizations confirm rotating platform ownership and content approval workflows.',
    content:
      'The Steering Committee met in Nairobi to finalize governance structures, including regional admin roles for LM country offices.',
    category: 'NEWS',
    publishedAt: '2026-05-01',
    author: 'IE Hub Secretariat',
  },
  {
    id: '3',
    slug: 'teacher-training-webinar-series',
    title: 'New webinar series on inclusive classroom practice',
    excerpt:
      'Free online sessions for teachers across LM office countries, with captions and transcripts.',
    content:
      'Starting July 2026, monthly webinars will cover UDL, reasonable accommodation, and parent-school partnership.',
    category: 'BLOG',
    publishedAt: '2026-04-18',
    author: 'Regional Education Team',
  },
]

export const events: EventItem[] = [
  {
    id: '1',
    title: 'IE Hub Soft Launch Webinar',
    description:
      'Introduction to the platform, resource library, and how to register as a member.',
    eventType: 'WEBINAR',
    startDatetime: '2026-06-16T10:00:00',
    endDatetime: '2026-06-16T11:30:00',
    locationType: 'ONLINE',
    onlineLink: 'https://example.com/register',
  },
  {
    id: '2',
    title: 'East Africa Inclusive Education Forum',
    description:
      'Regional practitioners share lessons on policy implementation and teacher training.',
    eventType: 'CONFERENCE',
    startDatetime: '2026-07-08T09:00:00',
    endDatetime: '2026-07-10T17:00:00',
    locationType: 'HYBRID',
    locationAddress: 'Nairobi, Kenya',
    onlineLink: 'https://example.com/forum',
  },
  {
    id: '3',
    title: 'Assistive Technology in Schools Workshop',
    description:
      'Hands-on workshop for orthopaedic technologists and education officers.',
    eventType: 'WORKSHOP',
    startDatetime: '2026-08-22T08:30:00',
    endDatetime: '2026-08-22T16:00:00',
    locationType: 'IN_PERSON',
    locationAddress: 'Kampala, Uganda',
  },
]

export const partners = [
  'LM International',
  'Humanity & Inclusion',
  'Sense International',
  'LWF',
  'ADRA',
  'NCPWD',
  'Help a Child',
  'IAS Denmark',
]

export const steeringCommittee = [
  'Ministry of Education',
  'FIDA',
  'Help a Child',
  'ADRA',
  'Humanity & Inclusion',
  'Lutheran World Federation',
  'Kenya Society for Deaf Children',
  'Sense International',
  'UDPK',
  'FPFK',
  'IAS Denmark',
  'DORCAS',
  'NCPWD',
]

export const lmOffices = [
  'Kenya',
  'Uganda',
  'Tanzania',
  'Sudan',
  'South Sudan',
  'Chad',
  'Ethiopia',
  'Somalia',
  'Rwanda & Burundi',
  'DRC',
  'Niger & Mali',
]
