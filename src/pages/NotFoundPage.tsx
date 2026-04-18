import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-5 text-center">
      <div className="panel-luxe max-w-lg px-8 py-12">
        <p className="section-label justify-center">404</p>
        <h1 className="mt-5 font-display text-5xl text-[color:var(--color-paper)]">
          Esta página não foi encontrada.
        </h1>
        <p className="mt-4 text-base text-white/70">
          O endereço que você tentou abrir não está disponível neste convite.
        </p>
        <Link className="button-primary mt-8 inline-flex" to="/">
          Voltar para o convite
        </Link>
      </div>
    </div>
  );
}
