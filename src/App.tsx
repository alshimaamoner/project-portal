import { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PreferencesProvider } from './context/PreferencesContext';
import { withAuth } from './components/hocs';
import { LoadingIndicator } from './components/LoadingIndicator';
import { DashboardLayout, RootLayout } from './components/Layouts';
import { HomePage, LoginPage, NotFoundPage } from './pages/General';
import { OverviewRoute, ProjectDetailsRoute, ProjectsRoute } from './pages/Projects';

const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const ProtectedDashboard = withAuth(DashboardLayout);
const AdminSettings = withAuth(SettingsPage, { role: 'admin' });

// Export the route tree separately so tests can supply MemoryRouter.
export function AppRoutes() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route index element={<HomePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="dashboard" element={<ProtectedDashboard />}>
          <Route index element={<OverviewRoute />} />
          <Route path="projects" element={<ProjectsRoute />} />
          <Route path="projects/:projectId" element={<ProjectDetailsRoute />} />
          <Route
            path="settings"
            element={
              <Suspense fallback={<LoadingIndicator />}>
                <AdminSettings />
              </Suspense>
            }
          />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <PreferencesProvider>
          <AppRoutes />
        </PreferencesProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
