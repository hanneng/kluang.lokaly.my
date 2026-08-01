import { Icon } from '@/components/ui/icon';

const valueProps = [
  {
    icon: 'UtensilsCrossed',
    title: 'Food & Cafes',
    description: 'Discover the best local food, hawker stalls, kopitiams and hidden restaurants.',
  },
  {
    icon: 'BedDouble',
    title: 'Hotels & Homestays',
    description: 'Find accommodations that fit your budget and are actually near what matters.',
  },
  {
    icon: 'MapPin',
    title: 'Attractions',
    description: 'Explore natural wonders, heritage sites and iconic landmarks worth your time.',
  },
  {
    icon: 'Calendar',
    title: 'Events',
    description: 'Stay updated on festivals, markets, concerts and community events happening now.',
  },
  {
    icon: 'ShoppingBag',
    title: 'Local Businesses',
    description: 'Support local shops, services and entrepreneurs in every town.',
  },
  {
    icon: 'Image',
    title: 'Hidden Gems',
    description: 'Uncover the secret spots that most visitors drive straight past.',
  },
  {
    icon: 'Newspaper',
    title: 'Travel Guides',
    description: 'Read long-form guides and stories written by locals who know their town.',
  },
];

export function ValueProps() {
  return (
    <section className="py-20 sm:py-28 lg:py-36 bg-surface-2">
      <div className="container-page">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">What You'll Find</h2>
          <p className="text-lg text-ink-subtle max-w-2xl mx-auto">
            Every town guide features curated content across key categories to help you discover the best local
            experiences.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {valueProps.map((prop) => (
            <div key={prop.title} className="flex flex-col gap-4">
              <div className="flex items-center justify-center size-14 rounded-full bg-brand/10">
                <Icon name={prop.icon} className="size-6 text-brand" />
              </div>
              <div>
                <h3 className="text-lg font-bold mb-2">{prop.title}</h3>
                <p className="text-ink-muted leading-relaxed">{prop.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
