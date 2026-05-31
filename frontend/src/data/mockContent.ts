import type { EventItem, FocusArea, ImpactStat, NewsArticle, Resource } from '@/types/content'

export const impactStats: ImpactStat[] = [
  {
    id: '1',
    value: '5,000+',
    label: 'Members Served',
    description: 'Active practitioners in our Community of Practice',
  },
  {
    id: '2',
    value: '120+',
    label: 'Projects Completed',
    description: 'Inclusive education initiatives across the continent',
  },
  {
    id: '3',
    value: '1M+',
    label: 'Beneficiaries Reached',
    description: 'Learners with disabilities supported by our programmes',
  },
  {
    id: '4',
    value: '54',
    label: 'Counties Covered',
    description: 'Continental reach across all African nations',
  },
  {
    id: '5',
    value: '85',
    label: 'Training Programs',
    description: 'Teacher capacity building sessions conducted',
  },
  {
    id: '6',
    value: '13',
    label: 'Partners Engaged',
    description: 'Leading organizations in our Steering Committee',
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

export const missionVision = {
  mission: 'To empower persons with disabilities through inclusive education and sustainable community development across Africa.',
  vision: 'A continent where every person, regardless of ability, has equal access to education, opportunities, and a dignified life.',
  goal: 'To reach 1 million learners with disabilities by 2030 through policy influence and practitioner support.',
  motto: 'Inclusion is not a favor, it is a right.',
}

export const coreValues = [
  {
    title: 'Integrity',
    description: 'We uphold the highest ethical standards in all our actions and decisions.',
  },
  {
    title: 'Inclusion',
    description: 'We believe in a world where everyone belongs and has a voice.',
  },
  {
    title: 'Accountability',
    description: 'We take responsibility for our impact and are transparent with our stakeholders.',
  },
  {
    title: 'Innovation',
    description: 'We embrace creative solutions to overcome barriers to inclusion.',
  },
  {
    title: 'Empowerment',
    description: 'We support individuals and communities to take charge of their own futures.',
  },
  {
    title: 'Collaboration',
    description: 'We work together with partners to achieve greater impact.',
  },
]

export const leadershipTeam = [
  {
    name: 'Dr. Sarah Johnson',
    role: 'Executive Director',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&q=80',
  },
  {
    name: 'Samuel Okello',
    role: 'Board Chairperson',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&q=80',
  },
  {
    name: 'Grace Mwangi',
    role: 'Program Manager',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&q=80',
  },
  {
    name: 'David Chen',
    role: 'Finance Officer',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&q=80',
  },
  {
    name: 'Aisha Toure',
    role: 'Communications Officer',
    image: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&h=400&q=80',
  },
]

export const regionalHubs = [
  {
    name: 'East & Central Africa',
    location: 'Nairobi & Kampala',
    description: 'Coordinating regional advocacy, teacher training, and inclusive pedagogy across the Great Lakes region.',
  },
  {
    name: 'West & North Africa',
    location: 'Dakar & Niamey',
    description: 'Focusing on policy reform, education in emergencies, and cross-border research initiatives.',
  },
  {
    name: 'Southern Africa',
    location: 'Lusaka & Harare',
    description: 'Supporting OPD capacity building and community-based rehabilitation programmes.',
  },
]

export const ourHistory = [
  {
    year: '2024',
    title: 'Foundation',
    description: 'IE Hub was conceptualized by LM International as a response to the gap in continental resource sharing for inclusive education.',
  },
  {
    year: '2025',
    title: 'Steering Committee Formation',
    description: '13 leading organisations across Africa joined forces to govern and guide the platform development.',
  },
  {
    year: '2026',
    title: 'Platform Soft Launch',
    description: 'Launch of the public website and the Community of Practice, connecting practitioners across 54 countries.',
  },
]
