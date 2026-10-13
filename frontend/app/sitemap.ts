import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/utils/site';
import enTeam from './i18n/locales/en/ourTeam.json';
import enAffiliates from './i18n/locales/en/ourTeamAffiliates.json';

const publicRoutes = [
  '',
  '/about-us',
  '/academy',
  '/acceleration',
  '/affiliate-registration-form',
  '/investment',
  '/investor-registration',
  '/join-as-a-mentor',
  '/join-as-a-trainee',
  '/join-our-team',
  '/join-us',
  '/our-team',
  '/pnp',
  '/startup',
  '/startups-validation',
];

const people = enTeam.roles as unknown as Record<string, {
  people?: Array<{ slug?: string }>;
}>;
const profileSlugs = Array.from(new Set(
  Object.values(people)
    .flatMap((role) => role.people || [])
    .map((p) => p.slug)
    .filter((slug): slug is string => Boolean(slug)),
));
const affiliates = enAffiliates.affiliates.partners;

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    ...publicRoutes,
    ...profileSlugs.map((slug) => `/profile/${encodeURIComponent(slug)}`),
    ...affiliates.map((affiliate) => `/affiliate/${encodeURIComponent(affiliate.slug)}`),
    ...affiliates.map((affiliate) => `/affiliate/${encodeURIComponent(affiliate.slug)}/apply`),
  ];

  // English is the only public, indexable locale until the Persian launch.
  return routes.map((path) => ({
    url: `${SITE_URL}/en${path}`,
    changeFrequency: path === '' ? 'weekly' as const : 'monthly' as const,
    priority: path === '' ? 1 : path.startsWith('/profile/') ? 0.5 : 0.7,
  }));
}
