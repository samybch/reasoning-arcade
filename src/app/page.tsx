const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

export default function Home() {
  return (
    <main style={{height:'100dvh',overflow:'hidden'}}>
      <iframe
        src={`${basePath}/preview/index.html`}
        title="Reasoning Arcade bilingual interactive prototype"
        style={{width:'100%',height:'100%',border:0}}
      />
    </main>
  );
}
