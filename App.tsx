import React from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import Layout from './components/Layout'; // Admin/Sidebar Layout
import ClientLayout from './components/ClientLayout'; // Public Topbar Layout
import Login from './pages/Login';
import Signup from './pages/Signup';

// Admin Pages
import Dashboard from './pages/Dashboard';
import Schedule from './pages/Schedule';
import Clients from './pages/Clients';
import Staff from './pages/Staff';
import Requests from './pages/Requests';
import BookingRequests from './pages/BookingRequests'; // New Artist Booking Requests
import ServiceHistory from './pages/ServiceHistory';
import Reports from './pages/Reports';
import Profile from './pages/Profile'; // New Profile Page
import ArtistAppointmentDetails from './pages/ArtistAppointmentDetails'; // Nova página

// Client Pages
import Landing from './pages/client/Landing';
import Booking from './pages/client/Booking';
import Artists from './pages/client/Artists';
import ArtistProfile from './pages/client/ArtistProfile'; // New Artist Public Profile
import Gallery from './pages/client/Gallery';
import ClientDashboard from './pages/client/ClientDashboard';
import ClientAppointmentDetails from './pages/client/ClientAppointmentDetails'; // Nova página
import Matchmaker from './pages/client/Matchmaker';

// Component to protect routes that require client login
const RequireAuth = ({ children }: { children?: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div className="h-screen w-full flex items-center justify-center bg-background-dark text-white">Carregando...</div>;

  if (!user) {
    // Redirect to login but save the attempted location
    return <Navigate to={`/login?redirect=${location.pathname}`} replace />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <HashRouter>
        <Routes>
          {/* Public Routes (Landing, Auth, etc) - Uses Topbar Layout */}
          <Route element={<ClientLayout />}>
            <Route path="/" element={<Landing />} />
            <Route path="/match" element={<Matchmaker />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/artist-profile" element={<ArtistProfile />} />

            <Route
              path="/profile"
              element={
                <RequireAuth>
                  <Profile />
                </RequireAuth>
              }
            />
          </Route>

          {/* Authenticated Routes (Clients & Admin) - Uses Sidebar Layout */}
          <Route element={<Layout />}>
            {/* Client Protected Routes */}
            <Route
              path="/my-appointments"
              element={
                <RequireAuth>
                  <ClientDashboard />
                </RequireAuth>
              }
            />
            {/* Rota para Detalhes (Cliente) */}
            <Route
              path="/my-appointments/:id"
              element={
                <RequireAuth>
                  <ClientAppointmentDetails />
                </RequireAuth>
              }
            />
            <Route
              path="/book"
              element={
                <RequireAuth>
                  <Booking />
                </RequireAuth>
              }
            />
            {/* Gallery is now Protected */}
            <Route
              path="/gallery"
              element={
                <RequireAuth>
                  <Gallery />
                </RequireAuth>
              }
            />

            {/* Shared Pages with Sidebar context for logged in users */}
            <Route path="/artists" element={<Artists />} />


            {/* Admin Routes */}
            <Route path="/admin">
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="booking-requests" element={<BookingRequests />} />
              <Route path="schedule" element={<Schedule />} />

              {/* Rota Detalhes Agendamento (Artista) */}
              <Route path="appointment/:id" element={<ArtistAppointmentDetails />} />

              <Route path="clients" element={<Clients />} />
              <Route path="staff" element={<Staff />} />
              <Route path="requests" element={<Requests />} />
              <Route path="history" element={<ServiceHistory />} />
              <Route path="reports" element={<Reports />} />
              <Route path="profile" element={<Profile />} />
              <Route index element={<Navigate to="dashboard" replace />} />
            </Route>
          </Route>

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </AuthProvider>
  );
};

export default App;
