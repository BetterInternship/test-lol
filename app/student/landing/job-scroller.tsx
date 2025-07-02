import LogoFlip from '../../../components/ui/LogoFlip';

export default function JobScrollerPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Featured Companies</h1>
      <LogoFlip
        data={[
          {
            image: '/manulife.png',
            name: 'Manulife'
          },
          {
            image: '/jollibee.png',
            name: 'Jollibee'
          },
          {
            image: '/firstgen.png',
            name: 'First Gen'
          },
          {
            image: '/sunlife.png',
            name: 'Sun Life Financial'
          },
          {
            image: '/oracle.png',
            name: 'Oracle'
          },
          {
            image: '/alaska.png',
            name: 'Alaska Milk Corporation'
          },
          {
            image: '/wwf.png',
            name: 'WWF'
          },
          {
            image: '/aim.png',
            name: 'Asian Institute of Management'
          },
          {
            image: '/manulife.png',
            name: 'Manulife'
          },
          {
            image: '/oracle.png',
            name: 'Oracle'
          }
        ]}
      />
    </div>
  );
}
