import { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Toaster } from "sonner";
import HomePage from "@/pages/HomePage";
import NotFoundPage from "@/pages/NotFoundPage";

const AdminPage = lazy(() => import("@/pages/AdminPage"));

function LoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#08120f] text-[#e9dcc4]">
      <div className="panel-luxe flex items-center gap-4 px-6 py-5">
        <Loader2 className="size-5 animate-spin text-[color:var(--color-gold-soft)]" />
        <span className="text-sm uppercase tracking-[0.3em] text-white/70">
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
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate replace to="/404" />} />
      </Routes>
      <Toaster
        richColors
        position="top-center"
        toastOptions={{
          classNames: {
            toast:
              "!border-white/10 !bg-[#10211c] !text-[#f8f1e2] !shadow-[0_24px_80px_rgba(0,0,0,0.35)]",
            description: "!text-[#d4c7ae]",
          },
        }}
      />
    </>
  );
}
