import LogoFlip from '@/components/ui/LogoFlip';

export default function JobScrollerPage() {
  return (
    <div className="gap-1 space-y-4">
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
            image: '/logos/manulife.png',
            name: 'Manulife'
          },
          {
            image: '/logos/sunlife.png',
            name: 'Sun Life Financial'
          },
          {
            image: '/logos/manulife.png',
            name: 'Manulife'
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
          },
          {
            image: '/logos/manulife.png',
            name: 'Manulife'
          },
          {
            image: '/logos/sunlife.png',
            name: 'Sun Life Financial'
          }
        ]}
        
      />
    </div>
  );
}
