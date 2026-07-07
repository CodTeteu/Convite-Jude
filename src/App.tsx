import { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Toaster } from "sonner";
import HomePage from "@/pages/HomePage";
import NotFoundPage from "@/pages/NotFoundPage";

const AdminPage = lazy(() => import("@/pages/AdminPage"));
const GiftListPage = lazy(() => import("@/pages/GiftListPage"));

function LoadingScreen() {
  return (
    <div className="invite-page flex min-h-screen items-center justify-center">
      <div className="invite-card-strong flex items-center gap-4 px-6 py-5">
        <Loader2 className="size-5 animate-spin text-[var(--invite-gold)]" />
        <span className="text-sm uppercase tracking-[0.3em] text-[var(--invite-brown-soft)]">
          Abrindo painel
        </span>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/admin"
          element={
            <Suspense fallback={<LoadingScreen />}>
              <AdminPage />
            </Suspense>
          }
        />
        <Route
          path="/presentes"
          element={
            <Suspense fallback={<LoadingScreen />}>
              <GiftListPage />
            </Suspense>
          }
        />
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate replace to="/404" />} />
      </Routes>
      <Toaster
        richColors
        position="top-center"
        toastOptions={{
          classNames: {
            toast:
              "!border-[var(--invite-line)] !bg-white/95 !text-[var(--invite-brown)] !shadow-[var(--invite-shadow)] !backdrop-blur-md",
            description: "!text-[var(--invite-brown-soft)]",
          },
        }}
      />
    </>
  );
}
