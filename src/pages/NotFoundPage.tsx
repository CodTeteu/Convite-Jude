import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="invite-page flex min-h-screen items-center justify-center px-5 text-center">
      <div className="invite-card-strong max-w-lg px-8 py-12">
        <p className="text-center font-heading text-[0.72rem] uppercase tracking-[0.32em] text-[var(--invite-sage)]">
          404
        </p>
        <h1 className="mt-5 font-heading text-5xl text-[var(--invite-brown)]">
          Esta página não foi encontrada.
        </h1>
        <p className="mt-4 font-body text-xl text-[var(--invite-brown-soft)]">
          O endereço que você tentou abrir não está disponível neste convite.
        </p>
        <Link className="invite-button-primary mt-8 inline-flex" to="/">
          Voltar para o convite
        </Link>
      </div>
    </div>
  );
}
