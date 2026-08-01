import { allTowns } from '@/config/towns';
import { Icon } from '@/components/ui/icon';

const states = [
  { name: 'Johor', emoji: '🏝️', towns: ['Kluang'] },
  { name: 'Pahang', emoji: '⛰️', towns: ['Kuantan', 'Kuala Terengganu'] },
  { name: 'Perak', emoji: '🏔️', towns: ['Ipoh', 'Taiping'] },
  { name: 'Selangor', emoji: '🏙️', towns: ['Selangor'] },
  { name: 'Melaka', emoji: '🕌', towns: ['Melaka'] },
  { name: 'Negeri Sembilan', emoji: '🌾', towns: ['Seremban'] },
  { name: 'Kedah', emoji: '🌅', towns: ['Alor Setar'] },
  { name: 'Kelantan', emoji: '🎨', towns: ['Kota Bharu'] },
];

export function BrowseStates() {
  return (
    <section className="py-20 sm:py-28 lg:py-36">
      <div className="container-page">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Browse by State</h2>
          <p className="text-lg text-ink-subtle max-w-2xl mx-auto">
            Explore hyperlocal guides across every state in Malaysia
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {states.map((state) => (
            <button
              key={state.name}
              className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-surface to-surface-2 p-6 border border-line hover:border-brand transition-all hover:shadow-lg"
            >
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{state.emoji}</div>
              <h3 className="text-lg font-semibold mb-2 group-hover:text-brand transition-colors">{state.name}</h3>
              <p className="text-xs text-ink-subtle">
                {state.towns.length} town{state.towns.length !== 1 ? 's' : ''}
              </p>
            </button>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-ink-muted mb-4">
            We're expanding to cover towns across all 13 states and 3 federal territories
          </p>
          <div className="inline-flex items-center gap-2 text-sm font-medium text-brand">
            <Icon name="Zap" className="size-4" />
            Help us bring Lokaly to your town — become a community partner
          </div>
        </div>
      </div>
    </section>
  );
}
