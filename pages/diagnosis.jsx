import { useState } from "react";
import { useRouter } from "next/router";
import { questions } from "../data/questions";

const QUESTIONS_PER_PAGE = 4;

export default function Diagnosis() {
  const [page, setPage] = useState(0);
  const [answers, setAnswers] = useState([]);
  const router = useRouter();

  const handleAnswer = (questionIndex, value) => {
    const updatedAnswers = [...answers];
    updatedAnswers[page * QUESTIONS_PER_PAGE + questionIndex] = value;
    setAnswers(updatedAnswers);
  };

  const handleNext = () => {
    setPage(page + 1);
  };

  const calculateType = (answers) => {
    const axisCount = { EI: 0, SN: 0, TF: 0, JP: 0 };
    answers.forEach((answer, index) => {
      const q = questions[index];
      if (q.axis && answer) {
        if (answer === "A") axisCount[q.axis]++;
        if (answer === "B") axisCount[q.axis]--;
      }
    });
    return (
      (axisCount.EI >= 0 ? "E" : "I") +
      (axisCount.SN >= 0 ? "S" : "N") +
      (axisCount.TF >= 0 ? "T" : "F") +
      (axisCount.JP >= 0 ? "J" : "P")
    );
  };

  const startIndex = page * QUESTIONS_PER_PAGE;
  const currentQuestions = questions.slice(startIndex, startIndex + QUESTIONS_PER_PAGE);
  const progress = Math.round((startIndex / questions.length) * 100);
  const isLastPage = startIndex + QUESTIONS_PER_PAGE >= questions.length;

  return (
    <div className="min-h-screen bg-white text-[#444] font-sans flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <div className="mb-6">
          <div className="flex justify-between mb-2 text-sm text-gray-500">
            <span>進捗 {progress}%</span>
            <span>
              {page + 1} / {Math.ceil(questions.length / QUESTIONS_PER_PAGE)} ページ
            </span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-2 bg-green-500 transition-all duration-500 ease-in-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {currentQuestions.map((q, idx) => (
          <div key={q.id} className="mb-6 p-5 bg-gray-50 rounded-xl shadow-md">
            <p className="text-sm text-green-600 font-semibold mb-1">
              🐾 Q{startIndex + idx + 1}
            </p>
            <p className="font-bold mb-3 text-base">{q.question}</p>
            <div className="flex flex-col gap-3">
              {["A", "B", "C"].map((opt) => {
                const isSelected = answers[startIndex + idx] === opt;
                return (
                  <button
                    key={opt}
                    onClick={() => handleAnswer(idx, opt)}
                    className={`py-3 px-4 text-left rounded-lg border transition-all duration-200 hover:bg-green-50 ${
                      isSelected
                        ? "bg-green-100 border-green-500 font-bold shadow-sm"
                        : "bg-white border-gray-300"
                    }`}
                  >
                    {isSelected && <span className="mr-2">✅</span>}
                    {q["option" + opt]}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        <div className="flex justify-end mt-6">
          {isLastPage ? (
            <button
              onClick={() => {
                const type = calculateType(answers);
                const resultUrl = `https://inunekotype.jp/result-16type-test/?type=${type}`;
                router.push(resultUrl);
              }}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-full shadow-lg"
            >
              診断結果を見る
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-full shadow-md"
            >
              次へ
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
