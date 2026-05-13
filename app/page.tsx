import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 to-zinc-800 flex flex-col items-center justify-center p-8">
      <h1 className="text-5xl font-extrabold text-white mb-4 drop-shadow-lg">
        DAWA — Laboratorio 9
      </h1>
      <p className="text-zinc-300 text-lg mb-12 text-center max-w-xl">
        Exploración de estrategias de renderizado en Next.js: Client-Side
        Rendering vs Server-Side Rendering.
      </p>

      <div className="flex flex-wrap gap-6 justify-center max-w-4xl">
        {/* Pokémon CSR */}
        <Link
          href="/pokemon-csr"
          className="group block w-80 bg-white/10 backdrop-blur rounded-2xl border-2 border-blue-400/30 p-6 hover:border-blue-400 hover:bg-white/15 transition-all"
        >
          <div className="text-4xl mb-3">⚡</div>
          <h2 className="text-xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">
            Pokémon — CSR
          </h2>
          <p className="text-zinc-400 text-sm leading-relaxed">
            Client-Side Rendering con <code className="text-blue-300">useState</code>,{" "}
            <code className="text-blue-300">useEffect</code> y llamada
            asíncrona desde el navegador. Incluye spinner de carga y manejo de
            errores.
          </p>
          <span className="inline-block mt-3 text-blue-300 text-sm font-semibold group-hover:translate-x-1 transition-transform">
            Ver ejercicio →
          </span>
        </Link>

        {/* Pokémon SSR */}
        <Link
          href="/pokemon-ssr"
          className="group block w-80 bg-white/10 backdrop-blur rounded-2xl border-2 border-green-400/30 p-6 hover:border-green-400 hover:bg-white/15 transition-all"
        >
          <div className="text-4xl mb-3">🖥️</div>
          <h2 className="text-xl font-bold text-white mb-2 group-hover:text-green-300 transition-colors">
            Pokémon — SSR
          </h2>
          <p className="text-zinc-400 text-sm leading-relaxed">
            Server-Side Rendering con async Server Component. Los datos se
            obtienen en el servidor antes de enviar el HTML al cliente.
          </p>
          <span className="inline-block mt-3 text-green-300 text-sm font-semibold group-hover:translate-x-1 transition-transform">
            Ver ejercicio →
          </span>
        </Link>

        {/* Weather Dashboard (Hybrid SSR + CSR) */}
        <Link
          href="/weather"
          className="group block w-80 bg-white/10 backdrop-blur rounded-2xl border-2 border-sky-400/30 p-6 hover:border-sky-400 hover:bg-white/15 transition-all"
        >
          <div className="text-4xl mb-3">🌤️</div>
          <h2 className="text-xl font-bold text-white mb-2 group-hover:text-sky-300 transition-colors">
            Clima — Híbrido
          </h2>
          <p className="text-zinc-400 text-sm leading-relaxed">
            Dashboard con Lima SSR + widget CSR para{" "}
            <code className="text-sky-300">Tokyo</code>,{" "}
            <code className="text-sky-300">New York</code>,{" "}
            <code className="text-sky-300">London</code> y{" "}
            <code className="text-sky-300">Sydney</code>.
          </p>
          <span className="inline-block mt-3 text-sky-300 text-sm font-semibold group-hover:translate-x-1 transition-transform">
            Ver ejercicio →
          </span>
        </Link>

        {/* Movies (placeholder) */}
        <div className="block w-80 bg-white/5 backdrop-blur rounded-2xl border-2 border-white/10 p-6 opacity-60 cursor-not-allowed">
          <div className="text-4xl mb-3">🎬</div>
          <h2 className="text-xl font-bold text-white mb-2">Películas — OMDb</h2>
          <p className="text-zinc-400 text-sm leading-relaxed">
            Galería de películas con búsqueda CSR + detalle desde OMDb API.
            Próximamente.
          </p>
          <span className="inline-block mt-3 text-zinc-500 text-sm font-semibold">
            Próximo →
          </span>
        </div>
      </div>
    </div>
  );
}
