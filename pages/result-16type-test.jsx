import { useRouter } from "next/router";

export default function Result() {
  const router = useRouter();
  const { type } = router.query;

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-2xl font-bold mb-4">診断結果</h1>
      <p className="text-lg">あなたのタイプは <strong>{type}</strong> です！</p>
      <p className="mt-4 text-sm text-gray-500">※ このページは仮の結果表示です</p>
    </main>
  );
}
