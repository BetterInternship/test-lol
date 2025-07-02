import LogoFlip from '@/components/ui/LogoFlip';

export default function JobScrollerPage() {
  return (
    <div className="p-6">
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
            image: '/logos/sunlife.png',
            name: 'Sun Life Financial'
          },
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
            image: '/logos/AIM.png',
            name: 'Asian Institute of Management'
          },
          {
            image: '/logos/Manulife.png',
            name: 'Manulife'
          },
          {
            image: '/logos/oracle.png',
            name: 'Oracle'
          },
          {
            image: '/logos/apc.jpeg',
            name: 'APC'
          }
        ]}
      />
    </div>
  );
}
