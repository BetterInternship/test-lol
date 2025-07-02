import LogoFlip from '@/components/ui/LogoFlip';

export default function JobScrollerPage() {
  return (
    <div className="gap-4 space-y-4">
      <h1 className="text-2xl font-bold mb-6">Featured Companies</h1>
      <LogoFlip
        data={[
          {
            image: '/logos/manulife.png',
            name: 'Manulife'
          },
          {
            image: '/logos/jollibee.png',
            name: 'Jollibee'
          },
          {
            image: '/logos/firstgen.png',
            name: 'First Gen'
          },
          {
            image: '/logos/sunlife.png',
            name: 'Sun Life Financial'
          }
        ]}
      />
      <LogoFlip
        data={[
          {
            image: '/logos/oracle.png',
            name: 'Oracle'
          },
          {
            image: '/logos/alaska.png',
            name: 'Alaska Milk Corporation'
          },
          {
            image: '/logos/wwf.png',
            name: 'WWF'
          },
          {
            image: '/logos/aim.png',
            name: 'Asian Institute of Management'
          }
        ]}
        
      />
      <LogoFlip
        data={[
          {
            image: '/logos/manulife.png',
            name: 'Manulife'
          },
          {
            image: '/logos/oracle.png',
            name: 'Oracle'
          }
        ]}
        
      />
    </div>
  );
}
