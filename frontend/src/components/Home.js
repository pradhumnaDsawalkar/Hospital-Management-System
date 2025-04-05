import React from 'react';
import {
  Calendar, Clipboard, Cog, DollarSign, HeartPulse,
  Hospital, Shield, User, Users, Clock, ChartBar, Globe
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Button = ({ children, primary, onClick, ...props }) => (
  <button
    className={`inline-flex items-center justify-center px-6 py-2 text-sm font-semibold rounded-2xl shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
      primary
        ? 'text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
        : 'text-gray-700 bg-white hover:bg-gray-100 focus:ring-blue-400'
    }`}
    onClick={onClick}
    {...props}
  >
    {children}
  </button>
);

const Card = ({ icon: Icon, title, description, primary }) => (
  <div className={`rounded-2xl shadow-lg p-6 transition hover:shadow-xl ${
    primary ? 'bg-white' : 'bg-gray-50'
  }`}>
    <Icon className="w-10 h-10 text-blue-600 mb-4" />
    <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
    <p className="text-gray-600 mb-4 leading-relaxed">{description}</p>
    <Button primary>Explore</Button>
  </div>
);

const Section = ({ children, bg = '', height = 'py-20' }) => (
  <section className={`${height} ${bg}`}>
    <div className="container mx-auto px-4 max-w-7xl">
      {children}
    </div>
  </section>
);

const Home = () => {
  const navigate = useNavigate();

  const handleButtonClick = (route) => {
    navigate(route);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 text-gray-900">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-5 bg-white shadow-sm">
        <div className="flex items-center gap-3">
          <Hospital className="w-9 h-9 text-blue-600" />
          <span className="text-2xl font-bold tracking-tight">Hospital Management System</span>
        </div>
        <nav className="flex items-center gap-4">
          <Button primary onClick={() => handleButtonClick('/login')}>Login</Button>
          <Button onClick={() => handleButtonClick('/signup')}>Sign Up</Button>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <Section bg="bg-blue-600 text-white" height="py-28">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <h1 className="text-5xl font-bold mb-6 leading-tight">
                Streamline Your Hospital Management
              </h1>
              <p className="text-lg mb-8">
                Optimize patient care, streamline operations, and boost efficiency with our smart hospital system.
              </p>
              <div className="flex gap-4">
                <Button primary onClick={() => handleButtonClick('/login')}>Explore Features</Button>
                <Button onClick={() => handleButtonClick('/login')}>Appointments</Button>
              </div>
            </div>
            <div className="rounded-xl overflow-hidden shadow-lg">
              <img src="home-1.jpeg" alt="Hospital preview" className="w-full h-auto" />
            </div>
          </div>
        </Section>

        {/* Services */}
        <Section>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: User, title: "Patient Management", description: "Manage patient records, appointments, and history efficiently." },
              { icon: Hospital, title: "Doctor Management", description: "Control doctor profiles, schedules, and assignments." },
              { icon: Calendar, title: "Appointment Scheduling", description: "Easily book and manage appointments for patients and doctors." }
            ].map((card, index) => (
              <Card key={index} {...card} primary />
            ))}
          </div>
        </Section>

        {/* Feature Highlight */}
        <Section bg="bg-white">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="rounded-xl overflow-hidden shadow-md">
              <img src="home-2.jpeg" alt="Modern operations" className="w-full h-auto" />
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-4">Modernize Your Hospital Operations</h2>
              <p className="text-lg text-gray-600 mb-6">
                Unlock advanced tools and automation that help you work smarter, serve patients better, and grow your hospital with confidence.
              </p>
              <div className="flex gap-4">
                <Button primary onClick={() => handleButtonClick('/login')}>Explore Features</Button>
                <Button onClick={() => handleButtonClick('/login')}>Appointments</Button>
              </div>
            </div>
          </div>
        </Section>

        {/* Why Choose Us */}
        <Section bg="bg-gray-50">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose Our Hospital Management System?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Clipboard, title: "Improved Efficiency", description: "Reduce paperwork, automate tasks, and focus on patient care." },
              { icon: Users, title: "Enhanced Patient Care", description: "Comprehensive records and smart scheduling improve service." },
              { icon: DollarSign, title: "Cost Savings", description: "Reduce overheads and increase operational ROI." },
              { icon: HeartPulse, title: "Better Patient Outcomes", description: "Streamlined workflows lead to better satisfaction." },
              { icon: Shield, title: "Secure Data", description: "Industry-grade encryption and role-based access control." },
              { icon: Cog, title: "Customizable", description: "Tailor features to your hospital’s exact needs." },
              { icon: Clock, title: "Time-Saving", description: "Automate daily tasks and reduce admin workload." },
              { icon: ChartBar, title: "Analytics", description: "Track and improve performance using visual insights." },
              { icon: Globe, title: "Scalable", description: "Perfect for small clinics and large hospital chains alike." }
            ].map((card, index) => (
              <Card key={index} {...card} />
            ))}
          </div>
        </Section>
      </main>

      {/* Footer */}
      <footer className="bg-white py-6 mt-10 shadow-inner border-t">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500">
          &copy; 2024 Hospital Management. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Home;
