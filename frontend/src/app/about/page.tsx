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

export default function AboutPage() {
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

//     {/* Hero Section */ }
      
        
          
//             {/* Text Content */ }
            
              
//                 About Me
              
              
//                 I'm a passionate Full Stack Web Developer with 5+ years of experience 
//                 building modern, scalable web applications that solve real - world problems.
              
              
//                 My expertise spans across frontend technologies like React and Vue.js,
//     backend frameworks like Laravel and Node.js, and cloud platforms like AWS. 
//                 I love turning complex problems into simple, beautiful, and intuitive solutions.
              
              
              
                
                  
//                   Download Resume
                
                
                  
//                   Contact Me




//   {/* Profile Image */ }





//   JD




//   {/* Social Links */ }
















//   {/* Stats Section */ }



//   {
//     stats.map((stat, index) => {
//       const Icon = stat.icon;
//       return (




//         { stat.value }
//                   { stat.label }
                
//               );
//   })
// }




// {/* Skills Section */ }
      
        
          
//             Technical Skills
//             Technologies and tools I work with
          

          
//             {
//   skills.map((skillGroup, index) => (


//     { skillGroup.category }
                
                
//                   {
//       skillGroup.items.map((item, itemIndex) => (


//         { item }

//       ))
//     }


//   ))
// }
          
        
      

//       {/* Experience Timeline */ }
      
        
          
//             Work Experience
//             My professional journey



// {/* Timeline Line */ }


// {/* Timeline Items */ }

// {
//   timeline.map((item, index) => (

//     {/* Timeline Dot */ }
                  

//                   {/* Content */ }
//     < div className = {`ml-20 md:ml-0 md:w-5/12 ${index % 2 === 0 ? 'md:mr-auto md:pr-12' : 'md:ml-auto md:pl-12'}`}>


//       { item.year }
// {
//   item.current && (

//     Current

//   )
// }

// { item.title }
// { item.company }
// { item.description }
                    
                  
                
//               ))}





// {/* Education & Certifications */ }



// {/* Education */ }



// Education
              
              
              
                
//                   Bachelor of Science in Computer Science
                
                
//                   University of Technology

// 2014 - 2018
                
//                   Graduated with honors.Focused on software engineering, algorithms,
//   and web technologies.Active member of the coding club and participated
//     in multiple hackathons.# Complete Frontend Files with HTML & Sample Data
  );
  }
