import Image from 'next/image';
import Link from 'next/link';
import {
  Award,
  Briefcase,
  GraduationCap,
  Code,
  Users,
  Clock,
  Trophy,
  Download,
  Mail,
  Linkedin,
  Github,
  Twitter
} from 'lucide-react';

export default function About() {
  const stats = [
    { label: 'Years Experience', value: '5+', icon: Clock },
    { label: 'Projects Completed', value: '50+', icon: Briefcase },
    { label: 'Happy Clients', value: '40+', icon: Users },
    { label: 'Awards Won', value: '8', icon: Trophy },
  ];

  const skills = [
    { category: 'Frontend', items: ['React', 'Next.js', 'Vue.js', 'TypeScript', 'Tailwind CSS'] },
    { category: 'Backend', items: ['Laravel', 'Node.js', 'Python', 'PHP', 'Express'] },
    { category: 'Database', items: ['MySQL', 'PostgreSQL', 'MongoDB', 'Redis'] },
    { category: 'DevOps', items: ['Docker', 'AWS', 'CI/CD', 'Linux', 'Git'] },
  ];

  const timeline = [
    {
      year: '2024',
      title: 'Senior Full Stack Developer',
      company: 'Tech Innovations Inc.',
      description: 'Leading development of enterprise-level web applications and mentoring junior developers.',
      current: true,
    },
    {
      year: '2021-2023',
      title: 'Full Stack Developer',
      company: 'Digital Solutions Agency',
      description: 'Developed custom web solutions for clients across various industries using modern tech stack.',
      current: false,
    },
    {
      year: '2019-2021',
      title: 'Frontend Developer',
      company: 'StartupTech',
      description: 'Built responsive user interfaces and collaborated with design team on UX improvements.',
      current: false,
    },
    {
      year: '2018-2019',
      title: 'Junior Developer',
      company: 'WebCraft Studio',
      description: 'Started my professional journey, learning best practices and contributing to various projects.',
      current: false,
    },
  ];

  const certifications = [
    { name: 'AWS Certified Solutions Architect', year: '2023', issuer: 'Amazon Web Services' },
    { name: 'Professional Scrum Master', year: '2022', issuer: 'Scrum.org' },
    { name: 'Laravel Certified Developer', year: '2021', issuer: 'Laravel' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <div>
              <h1 className="text-5xl font-bold mb-6">
                About Me
              </h1>
              <p className="text-xl text-blue-100 mb-4 leading-relaxed">
                I'm a passionate Full Stack Web Developer with 5+ years of experience 
                building modern, scalable web applications that solve real-world problems.
              </p>
              <p className="text-lg text-blue-100 mb-8 leading-relaxed">
                My expertise spans across frontend technologies like React and Vue.js,
                backend frameworks like Laravel and Node.js, and cloud platforms like AWS. 
                I love turning complex problems into simple, beautiful, and intuitive solutions.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/resume.pdf"
                  className="inline-flex items-center bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
                >
                  <Download className="mr-2" size={20} />
                  Download Resume
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
                >
                  <Mail className="mr-2" size={20} />
                  Contact Me
                </Link>
              </div>
            </div>

            {/* Profile Image */}
            <div className="flex flex-col items-center">
              <div className="relative w-64 h-64 rounded-full overflow-hidden border-8 border-white shadow-2xl mb-6">
                <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                  <span className="text-8xl font-bold text-white">JD</span>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex gap-4">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white bg-opacity-20 backdrop-blur-sm p-3 rounded-full hover:bg-opacity-30 transition-all"
                >
                  <Github size={24} />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white bg-opacity-20 backdrop-blur-sm p-3 rounded-full hover:bg-opacity-30 transition-all"
                >
                  <Linkedin size={24} />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white bg-opacity-20 backdrop-blur-sm p-3 rounded-full hover:bg-opacity-30 transition-all"
                >
                  <Twitter size={24} />
                </a>
                <a
                  href="mailto:hello@example.com"
                  className="bg-white bg-opacity-20 backdrop-blur-sm p-3 rounded-full hover:bg-opacity-30 transition-all"
                >
                  <Mail size={24} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                    <Icon size={32} className="text-blue-600" />
                  </div>
                  <div className="text-4xl font-bold text-gray-900 mb-2">{stat.value}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Technical Skills</h2>
            <p className="text-xl text-gray-600">Technologies and tools I work with</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {skills.map((skillGroup, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <Code className="mr-2 text-blue-600" size={24} />
                  {skillGroup.category}
                </h3>
                <ul className="space-y-2">
                  {skillGroup.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-center text-gray-700">
                      <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience Timeline */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Work Experience</h2>
            <p className="text-xl text-gray-600">My professional journey</p>
          </div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-blue-200"></div>

            {/* Timeline Items */}
            <div className="space-y-12">
              {timeline.map((item, index) => (
                <div key={index} className="relative">
                  {/* Timeline Dot */}
                  <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-600 rounded-full border-4 border-white shadow-lg"></div>

                  {/* Content */}
                  <div className={`ml-20 md:ml-0 md:w-5/12 ${index % 2 === 0 ? 'md:mr-auto md:pr-12' : 'md:ml-auto md:pl-12'}`}>
                    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow border-l-4 border-blue-600">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-semibold text-blue-600">{item.year}</span>
                        {item.current && (
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-semibold">
                            Current
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{item.title}</h3>
                      <p className="text-blue-600 font-semibold mb-3">{item.company}</p>
                      <p className="text-gray-600 leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Education & Certifications */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Education */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
                <GraduationCap className="mr-3 text-blue-600" size={32} />
                Education
              </h2>
              
              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-600">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Bachelor of Science in Computer Science
                </h3>
                <p className="text-blue-600 font-semibold mb-2">University of Technology</p>
                <p className="text-gray-600 mb-4">2014 - 2018</p>
                <p className="text-gray-700 leading-relaxed">
                  Graduated with honors. Focused on software engineering, algorithms,
                  and web technologies. Active member of the coding club and participated
                  in multiple hackathons.
                </p>
              </div>
            </div>

            {/* Certifications */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
                <Award className="mr-3 text-blue-600" size={32} />
                Certifications
              </h2>
              
              <div className="space-y-4">
                {certifications.map((cert, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{cert.name}</h3>
                    <p className="text-blue-600 font-semibold mb-1">{cert.issuer}</p>
                    <p className="text-gray-600 text-sm">{cert.year}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">Let's Work Together</h2>
          <p className="text-xl mb-8 text-blue-100">
            Have a project in mind? I'd love to hear about it and see how I can help.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors transform hover:scale-105 shadow-lg"
          >
            <Mail className="mr-2" size={20} />
            Get In Touch
          </Link>
        </div>
      </section>
    </div>
  );
}
