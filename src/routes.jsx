import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ResumeProvider } from './context/ResumeContext';
import AppLayout from './components/AppLayout';
import HomePage from './pages/HomePage';
import BuilderPage from './pages/BuilderPage';
import PreviewPage from './pages/PreviewPage';
import ProofPage from './pages/ProofPage';
import PremiumLayout from './components/PremiumLayout';
import RBStepPage from './pages/RBStepPage';
import RBProofPage from './pages/RBProofPage';
import { RB_BASE } from './config/rbSteps';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ResumeProvider>
        <AppLayout />
      </ResumeProvider>
    ),
    children: [
      { index: true, element: <HomePage /> },
      { path: 'builder', element: <BuilderPage /> },
      { path: 'preview', element: <PreviewPage /> },
      { path: 'proof', element: <ProofPage /> },
    ],
  },
  {
    path: RB_BASE,
    element: <PremiumLayout />,
    children: [
      { index: true, element: <Navigate to={`${RB_BASE}/01-problem`} replace /> },
      { path: '01-problem', element: <RBStepPage /> },
      { path: '02-market', element: <RBStepPage /> },
      { path: '03-architecture', element: <RBStepPage /> },
      { path: '04-hld', element: <RBStepPage /> },
      { path: '05-lld', element: <RBStepPage /> },
      { path: '06-build', element: <RBStepPage /> },
      { path: '07-test', element: <RBStepPage /> },
      { path: '08-ship', element: <RBStepPage /> },
      { path: 'proof', element: <RBProofPage /> },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
]);

export default router;
