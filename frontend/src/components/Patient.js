import React, { useState,useEffect } from 'react';
import { Calendar, Clock, FileText, User, Users, ChevronDown, Home, UserCircle, Calendar as CalendarIcon, Hospital } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Button = ({ children, variant = 'primary', className = '', ...props }) => (
  <button
    className={`inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
      variant === 'primary'
        ? 'text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
        : variant === 'outline'
        ? 'text-blue-600 border-blue-600 hover:bg-blue-50 focus:ring-blue-500'
        : 'text-blue-600 border-blue-600 hover:bg-blue-50 focus:ring-blue-500'
    } ${className}`}
    {...props}
  >
    {children}
  </button>
);


const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-lg shadow-md ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ children, icon: Icon }) => (
  <div className="px-4 py-5 border-b border-gray-200 sm:px-6 flex items-center justify-between">
    {children}
    {Icon && <Icon className="h-5 w-5 text-blue-600 ml-2" />}
  </div>
);

const CardTitle = ({ children }) => (
  <h3 className="text-lg leading-6 font-medium text-gray-900">{children}</h3>
);

const CardContent = ({ children }) => (
  <div className="px-4 py-5 sm:p-6">{children}</div>
);

const CardFooter = ({ children }) => (
  <div className="px-4 py-4 sm:px-6">{children}</div>
);

const Input = ({ ...props }) => (
  <input
    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md px-1 h-6"
    {...props}
  />
);

const Label = ({ children, htmlFor }) => (
  <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700">
    {children}
  </label>
);

const Select = ({ children, ...props }) => (
  <select
    className="mt-1 block w-full pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
    {...props}
  >
    {children}
  </select>
);

export default function PatientDashboard() {
  const [showAppointments, setShowAppointments] = useState(false);
  const [showPrescriptions, setShowPrescriptions] = useState(false);
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [isEditing, setIsEditing] = useState(false);
  const [patientInfo, setPatientInfo] = useState(null);
  const [editedInfo, setEditedInfo] = useState(null);
  const [doctors] = useState([]);
  const [appointmentData, setAppointmentData] = useState({
    doctorId: '',
    date: '',
    time: '',
    reason: ''
  });
  const [availableSlots, setAvailableSlots] = useState([]);
  const [appointments] = useState([]);
  const [careTeam] = useState([]);
  const [prescriptions] = useState([]);
  const navigate = useNavigate();


useEffect(() => {
  const fetchPatientInfo = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch('https://hospital-management-system-de1m.onrender.com/api/patient/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setPatientInfo(data); // Assuming you have state like const [patientInfo, setPatientInfo] = useState(null)
      } else {
        console.error('Failed to fetch patient info');
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
    }
  };

  fetchPatientInfo();
}, []);




  const fetchAvailableSlots = async (doctorId, date) => {
    if (!doctorId || !date) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/patient/available-slots?doctorId=${doctorId}&date=${date}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const slots = await response.json();
        setAvailableSlots(slots);
      } else {
        console.error('Failed to fetch available slots');
      }
    } catch (error) {
      console.error('Error fetching available slots:', error);
    }
  };


  const renderDashboard = () => (
    <>
     <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-blue-50 p-6">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

    {/* Appointments Card */}
    <Card className="backdrop-blur-md bg-blue-100/60 border border-blue-200/30 shadow-2xl rounded-2xl transition-all duration-300 hover:shadow-blue-200/50">
    <CardHeader icon={Calendar}>
        <CardTitle className="text-sm font-semibold text-blue-700">Today's Appointments</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-blue-800">{appointments.length}</div>
        {appointments.length > 0 ? (
          <p className="text-xs text-blue-600">
            Next: Dr. {appointments[0].doctorId.firstName} {appointments[0].doctorId.lastName} at {appointments[0].time}
          </p>
        ) : (
          <p className="text-xs text-blue-600">No appointments today</p>
        )}
      </CardContent>
      <CardFooter className="p-2">
        <Button 
          variant="ghost"
          className="w-full text-sm text-blue-600 hover:text-blue-800 transition-colors"
          onClick={() => setShowAppointments(!showAppointments)}
        >
          {showAppointments ? "Hide" : "View"} Today's Appointments
          <ChevronDown className={`h-4 w-4 ml-2 transition-transform ${showAppointments ? "rotate-180" : ""}`} />
        </Button>
      </CardFooter>
      {showAppointments && (
        <div className="px-4 pb-4">
          {appointments.length > 0 ? (
            appointments.map((appointment, index) => (
              <div key={index} className="flex justify-between items-center py-2 border-t">
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    Dr. {appointment.doctorId.firstName} {appointment.doctorId.lastName}
                  </p>
                  <p className="text-xs text-gray-500">{appointment.reason}</p>
                </div>
                <p className="text-sm font-semibold text-gray-700">{appointment.time}</p>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 text-center py-4">No appointments scheduled for today</p>
          )}
        </div>
      )}
    </Card>

    {/* Prescriptions Card */}
    <Card className="backdrop-blur-md bg-blue-100/60 border border-blue-200/30 shadow-2xl rounded-2xl transition-all duration-300 hover:shadow-blue-200/50">
    <CardHeader icon={FileText}>
        <CardTitle className="text-sm font-semibold text-blue-700">Prescriptions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-blue-800">{prescriptions.length}</div>
        <p className="text-xs text-blue-600">Active prescriptions</p>
      </CardContent>
      <CardFooter className="p-2">
        <Button 
          variant="ghost"
          className="w-full text-sm text-blue-600 hover:text-blue-800 transition-colors"
          onClick={() => setShowPrescriptions(!showPrescriptions)}
        >
          {showPrescriptions ? "Hide" : "View All"} Prescriptions
          <ChevronDown className={`h-4 w-4 ml-2 transition-transform ${showPrescriptions ? "rotate-180" : ""}`} />
        </Button>
      </CardFooter>
      {showPrescriptions && (
        <div className="px-4 pb-4">
          {prescriptions.map((prescription, index) => (
            <div key={index} className="py-2 border-t">
              <p className="text-sm font-medium text-gray-800">{prescription.medication}</p>
              <p className="text-xs text-gray-500">{prescription.dosage} - {prescription.frequency}</p>
              <p className="text-xs text-gray-500">
                Prescribed by: Dr. {prescription.doctorId.firstName} {prescription.doctorId.lastName}
              </p>
            </div>
          ))}
        </div>
      )}
    </Card>

  </div>

  {/* Bottom Row */}
  <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
    
    {/* Recent Activity Card */}
    <Card className="backdrop-blur-md bg-blue-100/60 border border-blue-200/30 shadow-2xl rounded-2xl transition-all duration-300 hover:shadow-blue-200/50">
    <CardHeader>
        <CardTitle className="text-sm font-semibold text-blue-700">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2 text-gray-700">
          <li className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-blue-500" />
            <span>Blood test results collected</span>
          </li>
          <li className="flex items-center gap-2">
            <User className="h-4 w-4 text-blue-500" />
            <span>Appointment with Dr. Johnson completed</span>
          </li>
          <li className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-blue-500" />
            <span>New prescription added</span>
          </li>
        </ul>
      </CardContent>
    </Card>

    {/* Care Team Card */}
    <Card className="backdrop-blur-md bg-blue-100/60 border border-blue-200/30 shadow-2xl rounded-2xl transition-all duration-300 hover:shadow-blue-200/50">
    <CardHeader>
        <CardTitle className="text-sm font-semibold text-blue-700">Your Care Team</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2 text-gray-700">
          {careTeam.map((member, index) => (
            <li key={index} className="flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-500" />
              <span>Dr. {member.firstName} {member.lastName} - {member.specialty}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>

  </div>
</div>


    </>
  );

  const renderProfile = () => {
    if (!patientInfo) {
      return (
        <div className="text-center py-10 text-gray-500">
          Loading profile...
        </div>
      );
    }
  
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setEditedInfo(prev => ({ ...prev, [name]: value }));
    };
  
    const handleSave = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('https://hospital-management-system-de1m.onrender.com/api/patient/profile', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(editedInfo)
        });
        if (response.ok) {
          const updatedProfile = await response.json();
          setPatientInfo(updatedProfile);
          setIsEditing(false);
        } else {
          const errorData = await response.json();
          alert(`Failed to update patient profile: ${errorData.error}`);
        }
      } catch (error) {
        alert('Error updating patient profile. Please try again.');
      }
    };
  
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={isEditing ? editedInfo.firstName : patientInfo.firstName}
                  onChange={handleInputChange}
                  readOnly={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={isEditing ? editedInfo.lastName : patientInfo.lastName}
                  onChange={handleInputChange}
                  readOnly={!isEditing}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={isEditing ? editedInfo.email : patientInfo.email}
                onChange={handleInputChange}
                readOnly={!isEditing}
              />
            </div>
          </form>
        </CardContent>
        <CardFooter>
          {isEditing ? (
            <>
              <Button onClick={handleSave} className="mr-2">Save</Button>
              <Button onClick={() => setIsEditing(false)} variant="outline">Cancel</Button>
            </>
          ) : (
            <Button
              onClick={() => {
                setEditedInfo(patientInfo); // Pre-fill edit form
                setIsEditing(true);
              }}
              className="ml-auto"
            >
              Edit Profile
            </Button>
          )}
        </CardFooter>
      </Card>
    );
  };
  

  const renderAppointmentBooking = () => {
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setAppointmentData(prev => ({ ...prev, [name]: value }));

      if (name === 'date' || name === 'doctorId') {
        fetchAvailableSlots(appointmentData.doctorId, value);
      }
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/patient/book-appointment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(appointmentData)
        });
        if (response.ok) {
          alert('Appointment booked successfully');
          setAppointmentData({
            doctorId: '',
            date: '',
            time: '',
            reason: ''
          });
          setAvailableSlots([]);
        } else {
          const errorData = await response.json();
          alert(`Failed to book appointment: ${errorData.error}`);
        }
      } catch (error) {
        alert('Error booking appointment. Please try again.');
      }
    };

    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Book an Appointment</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="doctorId">Select Doctor</Label>
              <Select id="doctorId" name="doctorId" value={appointmentData.doctorId} onChange={handleInputChange}>
                <option value="">Choose a doctor</option>
                {doctors.map((doctor) => (
                  <option key={doctor._id} value={doctor._id}>
                    Dr. {doctor.firstName} {doctor.lastName} - {doctor.specialty}
                  </option>
                ))}
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Appointment Date</Label>
              <Input id="date" name="date" type="date" value={appointmentData.date} onChange={handleInputChange}/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Preferred Time</Label>
              <Select id="time" name="time" value={appointmentData.time} onChange={handleInputChange} disabled={availableSlots.length === 0}>
                <option value="">Choose a time slot</option>
                {availableSlots.map((slot) => (
                  <option key={slot} value={slot}>{slot}</option>
                ))}
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="reason">Reason for Visit</Label>
              <Input id="reason" name="reason" value={appointmentData.reason} onChange={handleInputChange} placeholder="Brief description of your concern"/>
            </div>
            <Button type="submit" className="ml-auto">Book Appointment</Button>
          </form>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-blue-600">
      <header className="bg-white p-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Hospital className="h-6 w-6 text-blue-600" />
          <span className="font-bold text-xl">Hospital Management System</span>
        </div>
        <Button variant="outline" onClick={() => navigate('/')}>Sign Out</Button>
      </header>
      <nav className="bg-blue-700 text-white p-4">
        <ul className="flex space-x-4 justify-center">
          <li>
            <Button
              variant={activeTab === 'Dashboard' ? "outline" : "ghost"}
              className={`hover:bg-white hover:text-blue-600 ${activeTab === 'Dashboard' ? 'bg-white text-blue-600' : 'text-white'}`}
              onClick={() => setActiveTab('Dashboard')}
            >
              <Home className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
          </li>
          <li>
            <Button
              variant={activeTab === 'Profile' ? "outline" : "ghost"}
              className={`hover:bg-white hover:text-blue-600 ${activeTab === 'Profile' ? 'bg-white text-blue-600' : 'text-white'}`}
              onClick={() => setActiveTab('Profile')}
            >
              <UserCircle className="w-4 h-4 mr-2" />
              Profile
            </Button>
          </li>
          <li>
            <Button
              variant={activeTab === 'Appointment Booking' ? "outline" : "ghost"}
              className={`hover:bg-white hover:text-blue-600 ${activeTab === 'Appointment Booking' ? 'bg-white text-blue-600' : 'text-white'}`}
              onClick={() => setActiveTab('Appointment Booking')}

            >
              <CalendarIcon className="w-4 h-4 mr-2" />
              Appointment Booking
            </Button>
          </li>
        </ul>
      </nav>
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-white mb-8">Welcome, {patientInfo?.firstName} {patientInfo?.lastName}</h1>
        {activeTab === 'Dashboard' && renderDashboard()}
        {activeTab === 'Profile' && renderProfile()}
        {activeTab === 'Appointment Booking' && renderAppointmentBooking()}
      </main>
    </div>
  );
}