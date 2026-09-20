import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { FarmerLogin } from './pages/FarmerLogin';
import { FarmerDashboard } from './pages/FarmerDashboard';
import { FarmerFields } from './pages/FarmerFields';
import { FieldDetails } from './pages/FieldDetails';
import { SoilHealthCardPage } from './pages/SoilHealthCardPage';
import { DigitalSoilMaps } from './pages/DigitalSoilMaps';
import { SoilAnalysis } from './pages/SoilAnalysis';
import { Reports } from './pages/Reports';
import { ReportViewPage } from './pages/ReportViewPage';
import { Recommendations } from './pages/Recommendations';
import { Profile } from './pages/Profile';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ErrorState } from './components/ErrorState';
import { Layout } from './components/Layout';

export const App: React.FC = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<HomePage />} />
      <Route path="/farmer/login" element={<FarmerLogin />} />
      <Route path="/public/soil-report/:token" element={<ReportViewPage />} />

      {/* Authenticated Farmer Pages */}
      <Route
        path="/farmer/dashboard"
        element={
          <ProtectedRoute>
            <FarmerDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/farmer/fields"
        element={
          <ProtectedRoute>
            <FarmerFields />
          </ProtectedRoute>
        }
      />
      <Route
        path="/farmer/field/:fieldId"
        element={
          <ProtectedRoute>
            <FieldDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/farmer/field/:fieldId/soil-health"
        element={
          <ProtectedRoute>
            <SoilHealthCardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/farmer/soil-health"
        element={
          <ProtectedRoute>
            <SoilHealthCardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/farmer/soil-maps"
        element={
          <ProtectedRoute>
            <DigitalSoilMaps />
          </ProtectedRoute>
        }
      />
      <Route
        path="/farmer/soil-analysis"
        element={
          <ProtectedRoute>
            <SoilAnalysis />
          </ProtectedRoute>
        }
      />
      <Route
        path="/farmer/recommendations"
        element={
          <ProtectedRoute>
            <Recommendations />
          </ProtectedRoute>
        }
      />
      <Route
        path="/farmer/reports"
        element={
          <ProtectedRoute>
            <Reports />
          </ProtectedRoute>
        }
      />
      <Route
        path="/farmer/report/:reportId"
        element={
          <ProtectedRoute>
            <ReportViewPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/farmer/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      {/* 404 Catch All */}
      <Route
        path="*"
        element={
          <Layout>
            <div className="py-16">
              <ErrorState
                statusCode={404}
                title="Page Not Found"
                message="The requested page route was not found in the Digital Soil Mapping portal."
              />
            </div>
          </Layout>
        }
      />
    </Routes>
  );
};

export default App;
