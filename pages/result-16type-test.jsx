import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Result() {
  const router = useRouter();
  const { type } = router.query;

  useEffect(() => {
    if (!type) return;

    const urlMap = {
      INTJ: "https://inunekotype.jp/result-16type-intj-01/",
      INTP: "https://inunekotype.jp/result-16type-intp-01/",
      ENTJ: "https://inunekotype.jp/result-16type-entj-01/",
      ENTP: "https://inunekotype.jp/result-16type-entp-01/",
      INFJ: "https://inunekotype.jp/result-16type-infj-01/",
      INFP: "https://inunekotype.jp/result-16type-infp-01/",
      ENFJ: "https://inunekotype.jp/result-16type-enfj-01/",
      ENFP: "https://inunekotype.jp/result-16type-enfp-01/",
      ISTJ: "https://inunekotype.jp/result-16type-istj-01/",
      ISFJ: "https://inunekotype.jp/result-16type-isfj-01/",
      ESTJ: "https://inunekotype.jp/result-16type-estj-01/",
      ESFJ: "https://inunekotype.jp/result-16type-esfj-01/",
      ISTP: "https://inunekotype.jp/result-16type-istp-01/",
      ISFP: "https://inunekotype.jp/result-16type-isfp-01/",
      ESTP: "https://inunekotype.jp/result-16type-estp-01/",
      ESFP: "https://inunekotype.jp/result-16type-esfp-01/",
    };

    const targetUrl = urlMap[type];
    if (targetUrl) {
      window.location.href = targetUrl;
    }
  }, [type]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-2xl font-bold mb-4">診断結果へ移動中...</h1>
      <p className="text-lg">あなたのタイプは <strong>{type}</strong> です</p>
      <p className="mt-4 text-sm text-gray-500">※ページが切り替わらない場合はリロードしてください</p>
    </main>
  );
}
