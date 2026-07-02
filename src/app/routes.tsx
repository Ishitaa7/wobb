import { lazy, Suspense } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { PageLoader } from "@/components/ui/PageLoader";
import { SearchPage } from "@/pages/SearchPage";

const ProfileDetailPage = lazy(() =>
  import("@/pages/ProfileDetailPage").then((module) => ({
    default: module.ProfileDetailPage,
  }))
);

const SelectedListPage = lazy(() =>
  import("@/pages/SelectedListPage").then((module) => ({
    default: module.SelectedListPage,
  }))
);

export function AppRoutes() {
  const location = useLocation();

  return (
    <Suspense fallback={<PageLoader />}>
      <div key={location.pathname} className="animate-fade-in-up">
        <Routes location={location}>
          <Route path="/" element={<SearchPage />} />
          <Route path="/list" element={<SelectedListPage />} />
          <Route path="/profile/:username" element={<ProfileDetailPage />} />
        </Routes>
      </div>
    </Suspense>
  );
}
