import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { MainLayout } from './layouts/MainLayout';
import { AdminLayout } from './layouts/AdminLayout';
import { ProtectedRoute } from './components/common/ProtectedRoute';

// Public Pages
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { SkillsPage } from './pages/SkillsPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { ExperiencePage } from './pages/ExperiencePage';
import { ContactPage } from './pages/ContactPage';
import { LoginPage } from './pages/LoginPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Admin Pages
import { DashboardPage } from './pages/admin/DashboardPage';
import { ManageProjectsPage } from './pages/admin/ManageProjectsPage';
import { ManageSkillsPage } from './pages/admin/ManageSkillsPage';
import { ManageExperiencePage } from './pages/admin/ManageExperiencePage';
import { ManageEducationPage } from './pages/admin/ManageEducationPage';
import { ManageMessagesPage } from './pages/admin/ManageMessagesPage';
import { ManageProfilePage } from './pages/admin/ManageProfilePage';

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Layout Routes */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/skills" element={<SkillsPage />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/projects/:id" element={<ProjectDetailPage />} />
              <Route path="/experience" element={<ExperiencePage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/404" element={<NotFoundPage />} />
            </Route>

            {/* Protected Admin Routes */}
            <Route path="/admin" element={<ProtectedRoute />}>
              <Route element={<AdminLayout />}>
                <Route index element={<DashboardPage />} />
                <Route path="projects" element={<ManageProjectsPage />} />
                <Route path="skills" element={<ManageSkillsPage />} />
                <Route path="experience" element={<ManageExperiencePage />} />
                <Route path="education" element={<ManageEducationPage />} />
                <Route path="messages" element={<ManageMessagesPage />} />
                <Route path="profile" element={<ManageProfilePage />} />
              </Route>
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
