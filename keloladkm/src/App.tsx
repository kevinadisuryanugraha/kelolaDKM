import React, { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, useSearchParams } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { HeaderNavbar } from './components/common/HeaderNavbar';
import { Footer } from './components/common/Footer';
import { ExportModal } from './components/common/ExportModal';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { I18nProvider } from './i18n/I18nContext';

// Public Pages — lazy loaded
const PublicHome = lazy(() => import('./components/public/PublicHome').then(m => ({ default: m.PublicHome })));
const AboutSection = lazy(() => import('./components/public/AboutSection').then(m => ({ default: m.AboutSection })));
const OrganizationStructure = lazy(() => import('./components/public/OrganizationStructure').then(m => ({ default: m.OrganizationStructure })));
const ImamMuadzinKhatib = lazy(() => import('./components/public/ImamMuadzinKhatib').then(m => ({ default: m.ImamMuadzinKhatib })));
const PrayerTimesPage = lazy(() => import('./components/public/PrayerTimesPage').then(m => ({ default: m.PrayerTimesPage })));
const KajianSchedulePage = lazy(() => import('./components/public/KajianSchedulePage').then(m => ({ default: m.KajianSchedulePage })));
const DonationPublicPage = lazy(() => import('./components/public/DonationPublicPage').then(m => ({ default: m.DonationPublicPage })));
const ZakatCalculatorPage = lazy(() => import('./components/public/ZakatCalculatorPage').then(m => ({ default: m.ZakatCalculatorPage })));
const PublicFinancialReport = lazy(() => import('./components/public/PublicFinancialReport').then(m => ({ default: m.PublicFinancialReport })));
const NewsArticlePage = lazy(() => import('./components/public/NewsArticlePage').then(m => ({ default: m.NewsArticlePage })));
const DownloadsFAQContactPage = lazy(() => import('./components/public/DownloadsFAQContactPage').then(m => ({ default: m.DownloadsFAQContactPage })));
const LoginPage = lazy(() => import('./components/auth/LoginPage').then(m => ({ default: m.LoginPage })));

// Dashboard — lazy loaded
const DashboardMain = lazy(() => import('./components/dashboard/DashboardMain').then(m => ({ default: m.DashboardMain })));

const PageFallback = ({ label = 'Halaman' }: { label?: string }) => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div className="text-center space-y-3">
      <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
      <p className="text-sm text-slate-500 font-medium">Memuat {label}...</p>
    </div>
  </div>
);

/** Bi-directional sync between URL search params and AppContext state */
const URLSync: React.FC = () => {
  const { activeAppTab, publicSubTab, dashboardSubTab, setActiveAppTab, setPublicSubTab, setDashboardSubTab } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();

  // 1. Sync URL -> App state (on browser navigation)
  useEffect(() => {
    const urlTab = searchParams.get('tab');
    const urlSub = searchParams.get('sub');

    if (urlTab === 'dashboard' || urlTab === 'public') {
      if (urlTab !== activeAppTab) setActiveAppTab(urlTab);
      if (urlTab === 'dashboard' && urlSub && urlSub !== dashboardSubTab) setDashboardSubTab(urlSub);
      if (urlTab === 'public' && urlSub && urlSub !== publicSubTab) setPublicSubTab(urlSub);
    }
  }, [searchParams]);

  // 2. Sync App state -> URL (on user click/navigation)
  useEffect(() => {
    const currentSub = activeAppTab === 'dashboard' ? dashboardSubTab : publicSubTab;
    const urlTab = searchParams.get('tab');
    const urlSub = searchParams.get('sub');

    if (urlTab !== activeAppTab || urlSub !== currentSub) {
      setSearchParams({ tab: activeAppTab, sub: currentSub }, { replace: true });
    }
  }, [activeAppTab, publicSubTab, dashboardSubTab]);

  return null;
};

const MainAppContent: React.FC = () => {
  const { activeAppTab, publicSubTab, exportModalData } = useApp();

  // Dedicated standalone Login Page without HeaderNavbar or Footer
  if (activeAppTab === 'public' && publicSubTab === 'login') {
    return (
      <Suspense fallback={<PageFallback label="Halaman Login" />}>
        <LoginPage />
      </Suspense>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans flex flex-col justify-between selection:bg-emerald-500 selection:text-white">
      {activeAppTab === 'public' && <HeaderNavbar />}

      {activeAppTab === 'public' ? (
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Suspense fallback={<PageFallback label="Halaman" />}>
            {publicSubTab === 'home' && <PublicHome />}
            {publicSubTab === 'about' && <AboutSection />}
            {publicSubTab === 'organization' && <OrganizationStructure />}
            {publicSubTab === 'staff' && <ImamMuadzinKhatib />}
            {publicSubTab === 'prayer_times' && <PrayerTimesPage />}
            {publicSubTab === 'kajian' && <KajianSchedulePage />}
            {publicSubTab === 'donation' && <DonationPublicPage />}
            {publicSubTab === 'zakat_calculator' && <ZakatCalculatorPage />}
            {publicSubTab === 'financial_report' && <PublicFinancialReport />}
            {publicSubTab === 'news' && <NewsArticlePage />}
            {publicSubTab === 'faq_contact' && <DownloadsFAQContactPage />}
          </Suspense>
        </main>
      ) : (
        <main className="flex-1 w-full min-h-screen">
          <Suspense fallback={<PageFallback label="Dashboard" />}>
            <DashboardMain />
          </Suspense>
        </main>
      )}

      {activeAppTab === 'public' && <Footer />}
      {exportModalData.isOpen && <ExportModal />}
    </div>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <I18nProvider>
        <BrowserRouter>
          <AppProvider>
            <URLSync />
            <MainAppContent />
          </AppProvider>
        </BrowserRouter>
      </I18nProvider>
    </ErrorBoundary>
  );
}
