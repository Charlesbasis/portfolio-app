export function PersonSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Charles Valerio Howlader',
    jobTitle: 'Full Stack Web Developer',
    url: 'https://localhost:3000.com',
    sameAs: [
      'https://github.com/charlesbasis',
      'https://linkedin.com/in/charles-valerio-howlader',
    //   'https://twitter.com/yourusername'
    ],
    knowsAbout: ['Web Development', 'React', 'Next.js', 'Laravel', 'Node.js'],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
