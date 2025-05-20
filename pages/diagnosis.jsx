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
    <div className="min-h-screen bg-white text-[#444] font-sans flex flex-col items-center justify-center px-2 py-4">
      <div className="w-full max-w-3xl text-center">
        <div className="mb-6">
          <div className="mb-1 text-lg text-gray-500">進捗 {progress}%</div>
          <div className="mb-2 text-lg text-gray-500">{page + 1} / {Math.ceil(questions.length / QUESTIONS_PER_PAGE)} ページ</div>
          <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-4 bg-green-500 transition-all duration-500 ease-in-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {currentQuestions.map((q, idx) => (
          <div key={q.id} className="mb-6 p-6 bg-gray-50 rounded-xl shadow-md">
            <p className="text-xl text-green-600 font-bold mb-2">
              🐾 Q{startIndex + idx + 1}
            </p>
            <p className="font-bold text-2xl mb-6">{q.question}</p>
            <div className="flex flex-col items-center gap-6">
              {["A", "B", "C"].map((opt) => {
                const isSelected = answers[startIndex + idx] === opt;
                return (
                  <button
                    key={opt}
                    onClick={() => handleAnswer(idx, opt)}
                    className={`text-[40px] py-6 px-10 rounded-full border-4 transition-all duration-200 w-full max-w-2xl ${
                      isSelected
                        ? "bg-green-500 border-green-700 text-white font-extrabold"
                        : "bg-white border-gray-300 hover:bg-green-50"
                    }`}
                  >
                    {q["option" + opt]}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        <div className="flex justify-center mt-8">
          {isLastPage ? (
            <button
              onClick={() => {
                const type = calculateType(answers);
                const resultUrl = `https://inunekotype.jp/result-16type-test/?type=${type}`;
                router.push(resultUrl);
              }}
              className="bg-green-600 hover:bg-green-700 text-white text-[40px] font-bold py-5 px-12 rounded-full shadow-lg"
            >
              診断結果を見る
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="bg-green-600 hover:bg-green-700 text-white text-[40px] font-bold py-5 px-12 rounded-full shadow-md"
            >
              次へ
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
