import CursorGrid from './CursorGrid/CursorGrid.jsx';

// Decorative background snippet shown faded behind the hero copy.
// Kept as a module-level constant (not JSX-inline) so the large code
// string doesn't clutter the component's render output.
const HERO_CODE = `async def run_pipeline(query: str, tenant_id: str):
    docs = await retriever.aget_relevant_documents(
        query, filter={"tenant": tenant_id}, k=12
    )
    chunks = [normalize(d.page_content) for d in docs]
    embeddings = await embedder.aembed_documents(chunks)
    await vector_store.aupsert(embeddings, namespace=tenant_id)

    context = rerank(chunks, query, top_k=6)
    response = await llm.ainvoke(
        prompt.format(context=context, question=query)
    )
    await audit_log.record(tenant_id, query, response.usage)
    return response.content`;

/**
 * Full-viewport intro header: eyebrow label, headline, subhead, and the
 * faded decorative code snippet in the background.
 */
export default function Hero() {
  return (
    <header className="hero">
      {/* React Bits CursorGrid: fills the hero and lights up cells around
          the pointer. Decorative only, so it's hidden from assistive tech;
          .hero-content gets pointer-events: none (see index.css) so mouse
          moves over the headline still reach the grid underneath. */}
      <div className="hero-cursor-grid" aria-hidden="true">
        <CursorGrid
          cellSize={64}
          color="#4EA1FF"
          radius={160}
          falloff="smooth"
          maxOpacity={0.9}
          fillOpacity={0.08}
          gridOpacity={0.05}
        />
      </div>
      {/* Purely decorative background code snippet; hidden from assistive tech. */}
      <pre className="hero-code" aria-hidden="true">{HERO_CODE}</pre>
      <div className="hero-content">
        <div className="eyebrow">Full Stack Engineering &middot; AI/Platform</div>
        <h1>I build AI systems that scale<br />and platforms that don&apos;t fall over.</h1>
        <p className="hero-sub">
          RAG pipelines that hold up under enterprise data. Distributed systems that stay up.
          AI shipped into production — not demos.
        </p>
      </div>
    </header>
  );
}
