/**
 * PELÍCULAS — Galería de Películas y Series (OMDb API)
 *
 * ## Arquitectura Híbrida (SSR + CSR)
 *
 * - **SSR (Server-Side Rendering)**: La página obtiene películas populares
 *   (término fijo "avengers") en el servidor durante el request. Los datos se
 *   serializan en el HTML inicial, lo que beneficia:
 *   → SEO: los motores de búsqueda ven el contenido de inmediato.
 *   → FCP (First Contentful Paint): el usuario ve películas sin esperar JS.
 *   → Accesibilidad: el contenido está presente incluso sin JavaScript.
 *
 *   Justificacion SSR para lista inicial:
 *   - Los datos no dependen del usuario (misma búsqueda para todos).
 *   - El contenido es el propósito principal de la página (SEO relevante).
 *   - Renderizar en servidor elimina el flash de carga en el cliente.
 *
 * - **CSR (Client-Side Rendering)**: La búsqueda interactiva y el modal de
 *   detalle se ejecutan completamente en el cliente mediante `MovieGalleryClient`:
 *   → `SearchInput`: captura keystrokes con debounce de 300ms, dispara fetch
 *     a OMDb desde el navegador. Resultados se actualizan sin recargar la página.
 *   → `MovieModal`: overlay con detalles completos. Se abre al hacer clic en
 *     una tarjeta. Fetch de detalle por imdbID desde el cliente.
 *
 *   Justificacion CSR para búsqueda y modal:
 *   - Interacciones disparadas por el usuario después del render inicial.
 *   - No tienen valor SEO (son respuestas a acciones del usuario).
 *   - Recargar la página en cada búsqueda degradaría la UX.
 *   - El modal es condicional: la mayoría de usuarios no lo abren.
 *
 * ## Verificación Híbrida (DevTools)
 *
 * | Check                      | Lista inicial (SSR)               | Búsqueda (CSR)                    |
 * |----------------------------|-----------------------------------|-----------------------------------|
 * | View Source (Ctrl+U)       | Películas "avengers" en HTML      | Sin resultados de búsqueda        |
 * | Network Tab (carga inicial)| Sin XHR a OMDb para "avengers"   | Sin XHR hasta escribir búsqueda   |
 * | Network Tab (al buscar)    | N/A                               | XHR a omdbapi.com con ?s=termm   |
 * | Disable JavaScript         | Lista de películas visible        | Búsqueda no funciona              |
 * | Click en tarjeta           | N/A                               | XHR a omdbapi.com con ?i=imdbID  |
 */

import { searchMovies } from "@/lib/api/omdb";
import MovieGalleryClient from "./MovieGalleryClient";

/** SSR fetch: obtiene películas populares con un término fijo en el servidor. */
async function getInitialMovies() {
  try {
    const data = await searchMovies("avengers");
    if (data.Response === "True") {
      return data.Search;
    }
    return [];
  } catch {
    return [];
  }
}

export default async function PeliculasPage() {
  // SSR: fetch executed at request time on the server.
  // The resulting HTML contains the movie data — no client fetch required
  // for the initial view.
  const initialMovies = await getInitialMovies();

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-slate-950 to-black">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Page header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 drop-shadow-lg">
            🎬 Películas & Series
          </h1>
          <p className="text-zinc-400 text-lg max-w-xl mx-auto">
            Explora películas usando la API de OMDb. Búsqueda interactiva sin
            recargar la página.
          </p>
        </div>

        {/* Client gallery: receives SSR-initial movies, handles CSR search + modal */}
        <MovieGalleryClient initialMovies={initialMovies} />
      </div>
    </div>
  );
}
