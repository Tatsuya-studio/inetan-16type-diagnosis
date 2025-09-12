import { useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import { questions } from "../data/questions";
import { gtagEvent } from "../lib/ga";
import { useState, useRef } from "react";

export default function Diagnosis() {
  const router = useRouter();
  const total = questions.length; // 20想定
  const [answers, setAnswers] = useState(Array(total).fill(null));
  const [submitting, setSubmitting] = useState(false);
  const questionRefs = useRef([]);

  useEffect(() => {
    gtagEvent("diagnosis_start", { value: 1 });
    if (typeof window !== "undefined") window.scrollTo({ top: 0 });
  }, []);

  // 進捗（回答済み数ベースで更新）
  const answeredCount = useMemo(
    () => answers.filter((v) => v === "A" || v === "B" || v === "C").length,
    [answers]
  );
  const progress = Math.round((answeredCount / total) * 100);
  const allAnswered = answeredCount === total;

  const handleSelect = (index, opt) => {
    setAnswers((prev) => {
      if (prev[index] === opt) return prev;
      const next = [...prev];
      next[index] = opt;
      return next;
    });
  };

  const scrollToQuestion = (idx) => {
    const el =
      questionRefs.current[idx] ||
      (typeof document !== "undefined" && document.getElementById(`q-${idx}`));
    if (el && typeof el.scrollIntoView === "function") {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const handleSubmit = () => {
    if (!allAnswered) {
      // 未回答の最初の設問へスクロール
      const firstUnanswered = answers.findIndex((v) => v == null);
      if (firstUnanswered >= 0) {
        scrollToQuestion(firstUnanswered);
      }
      return;
    }
    if (submitting) return;
    setSubmitting(true);

    const rawType = calculateType(answers);
    const type = String(rawType).toUpperCase().trim();

    gtagEvent("result_type", { type });

    const validTypes = new Set([
      "INTJ","INTP","ENTJ","ENTP","INFJ","INFP","ENFJ","ENFP",
      "ISTJ","ISFJ","ESTJ","ESFJ","ISTP","ISFP","ESTP","ESFP"
    ]);

    if (validTypes.has(type)) {
      const target = `https://inunekotype.jp/result-16type-${type.toLowerCase()}-01/`;
      if (typeof window !== "undefined" && typeof window.gtag === "function") {
        window.gtag("event", "diagnosis_complete", {
          value: 1,
          type,
          transport_type: "beacon",
          event_callback: function () {
            window.location.assign(target);
          },
        });
        setTimeout(() => window.location.assign(target), 400);
      } else {
        window.location.assign(target);
      }
    } else {
      gtagEvent("diagnosis_complete", { value: 1, type: "invalid" });
      router.push(`/result-16type-test?type=${encodeURIComponent(type)}`);
    }
  };

  const calculateType = (_answers) => {
    const axisCount = { EI: 0, SN: 0, TF: 0, JP: 0 };
    _answers.forEach((answer, index) => {
      const q = questions[index];
      if (q?.axis && answer) {
        if (answer === "A") axisCount[q.axis]++;
        if (answer === "B") axisCount[q.axis]--;
        // "C" は中立
      }
    });
    return (
      (axisCount.EI >= 0 ? "E" : "I") +
      (axisCount.SN >= 0 ? "S" : "N") +
      (axisCount.TF >= 0 ? "T" : "F") +
      (axisCount.JP >= 0 ? "J" : "P")
    );
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-4 sm:p-6 bg-gradient-to-b from-[#fffaf3] to-[#fcefe4] text-gray-800 font-sans">
      <div className="w-full max-w-3xl">

        {/* ヘッダー / 進捗 */}
        <div className="mb-5 sm:mb-6">
          <div className="flex items-end justify-between mb-2">
            <div className="text-base sm:text-lg text-gray-600 font-medium">
              <div className="mb-1">進捗 {progress}%</div>
              <div>{answeredCount} / {total} 問</div>
            </div>
            <div className="text-xs sm:text-sm text-gray-500">
              タップで選択（変更可）
            </div>
          </div>
          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-3 rounded-full transition-all duration-300"
              style={{ width: `${progress}%`, backgroundColor: "#86efac" }} // green-300
            />
          </div>
        </div>

        {/* 質問リスト（全問1ページ表示） */}
        <div className="space-y-5 sm:space-y-6">
          {questions.map((q, idx) => {
            const sel = answers[idx];
            const isUnanswered = sel == null;
            const showDivider = (idx + 1) % 5 === 0 && idx !== total - 1;

            return (
              <div key={q.id} id={`q-${idx}`}
                   ref={(el) => (questionRefs.current[idx] = el)}
                   className={`px-5 sm:px-6 py-5 sm:py-6 bg-white border-2 rounded-2xl shadow-md ${
                     isUnanswered ? "border-[#f0c9a6]" : "border-[#e57d23]"
                   }`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xl sm:text-2xl">🐾 Q{idx + 1}</div>
                  <div className="text-xs text-gray-500">{q.axis || ""}</div>
                </div>
                <p className="text-lg sm:text-xl font-semibold mb-4 leading-relaxed">
                  {q.question}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  {["A", "B", "C"].map((opt) => (
                    <button
                      key={opt}
                      onClick={() => handleSelect(idx, opt)}
                      className={`w-full py-3 sm:py-4 px-4 text-[16px] sm:text-[18px] font-bold rounded-full shadow transition-all duration-150 border-2 focus:outline-none focus:ring-4
                        ${sel === opt
                          ? "bg-[#f4a261] text-white border-[#f4a261]"
                          : "bg-white border-gray-300 text-gray-700 hover:bg-[#ffe3c3]"}`}
                      aria-pressed={sel === opt}
                    >
                      {q["option" + opt]}
                    </button>
                  ))}
                </div>

                {showDivider && (
                  <div className="mt-5 sm:mt-6">
                    <div className="h-0.5 w-full bg-gray-200 rounded-full" />
                    <div className="text-center text-xs text-gray-400 mt-2">
                      ここまでで {idx + 1} / {total} 問
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* フッターCTA（固定） */}
        <div className="sticky bottom-3 mt-6 sm:mt-8 flex flex-col gap-3">
          <button
            onClick={handleSubmit}
            disabled={!allAnswered || submitting}
            className={`w-full sm:w-auto sm:self-center rounded-full text-white text-lg sm:text-xl font-semibold py-4 px-8 shadow-lg transition
              ${allAnswered && !submitting ? "bg-[#f4a261] hover:bg-[#e57d23]" : "bg-gray-300 cursor-not-allowed"}`}
          >
            {allAnswered ? (submitting ? "判定中…" : "診断結果を見る") : `未回答 ${total - answeredCount} 問`}
          </button>

          <button
            onClick={() => {
              setAnswers(Array(total).fill(null));
              if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="text-sm text-blue-500 underline hover:text-blue-700 self-center"
          >
            最初からやり直す
          </button>
        </div>

      </div>
    </div>
  );
}
