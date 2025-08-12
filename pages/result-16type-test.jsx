// pages/result-16type-test.jsx
import { useRouter } from "next/router";
import { useEffect } from "react";

const URL_MAP = {
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

export default function Result() {
  const router = useRouter();
  const { type } = router.query;

  useEffect(() => {
    // 1) クエリが入るまで待つ
    if (!router.isReady) return;

    // 2) 配列/小文字/余白などを正規化
    const raw = Array.isArray(type) ? type[0] : type;
    const key = String(raw || "").toUpperCase().trim();

    // 3) マップ参照 → 外部へ遷移（確実なのは window.location.assign）
    const target = URL_MAP[key];
    if (target) {
      window.location.assign(target);
      return;
    }

    // 4) マップ未ヒット時のフォールバック
    alert(`未対応タイプ "${key}" のためトップへ戻ります。`);
    router.replace("/"); // 必要に応じて /diagnosis に戻すなどに変更
  }, [router.isReady, type]); // ← isReady を依存に入れる

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-2xl font-bold mb-4">診断結果へ移動中...</h1>
      <p className="text-lg">
        あなたのタイプは <strong>{Array.isArray(type) ? type[0] : type}</strong> です
      </p>
      <p className="mt-4 text-sm text-gray-500">
        ※切り替わらない場合は再読み込みしてください
      </p>
    </main>
  );
}
