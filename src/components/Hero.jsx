import CursorGrid from './CursorGrid/CursorGrid.jsx';
import DecryptedText from './DecryptedText.jsx';
import MiniTerminal from './MiniTerminal.jsx';

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
 * Full-viewport intro: CursorGrid, faded code, a decrypting headline,
 * and a compact `vg@hyderabad` terminal under the subhead.
 */
export default function Hero() {
  return (
    <header className="hero" id="top">
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
        <div className="eyebrow">
          <DecryptedText
            text="Full Stack Engineering · AI/Platform"
            animateOn="mount"
            speed={28}
          />
        </div>
        <h1>
          <DecryptedText
            text="I build AI systems that scale"
            animateOn="mount"
            speed={24}
            delay={220}
          />
          <br />
          <DecryptedText
            text="and platforms that don't fall over."
            animateOn="mount"
            speed={24}
            delay={720}
          />
        </h1>
        <p className="hero-sub">
          RAG pipelines that hold up under enterprise data. Distributed systems that stay up.
          AI shipped into production — not demos.
        </p>
      </div>
      <MiniTerminal />
    </header>
  );
}
