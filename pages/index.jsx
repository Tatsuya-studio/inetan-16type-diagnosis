export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center p-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">いぬねこ16タイプ診断</h1>
        <p className="mb-6">診断スタートはこちらから！</p>
        <a href="/diagnosis" className="text-blue-500 underline">診断を始める</a>
      </div>
    </main>
  );
}
