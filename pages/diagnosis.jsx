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
    const unanswered = currentQuestions.some((_, idx) => !answers[startIndex + idx]);
    if (unanswered) {
      alert("すべての質問に回答してください。");
      return;
    }
    if ((page + 1) * QUESTIONS_PER_PAGE >= questions.length) {
      const type = calculateType(answers);
      const resultUrl = `https://inunekotype.jp/result-16type-test/?type=${type}`;
      router.push(resultUrl);
    } else {
      setPage(page + 1);
    window.scrollTo({ top: 0, behavior: "smooth" }); // ← これを追加
  }
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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-[#fffaf3] to-[#fcefe4] text-gray-800 font-sans">
      <div className="w-full max-w-xl">
        <div className="mb-6">
          <div className="text-lg text-gray-600 font-medium mb-2">
            <div className="mb-1">進捗 {progress}%</div>
            <div>{startIndex + 1} / {questions.length} 問</div>
          </div>
          <div className="w-full h-3 bg-gray-200 rounded-full">
            <div
              className="h-3 bg-[#f4a261] rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {currentQuestions.map((q, idx) => {
          const isSelected = answers[startIndex + idx];
          return (
            <div key={q.id} className="mb-8 px-6 py-6 bg-white border-2 border-[#e57d23] rounded-2xl shadow-md">
              <div className="text-2xl mb-2">🐾 Q{startIndex + idx + 1}</div>
              <p className="text-xl font-semibold mb-4">{q.question}</p>
              <div className="flex flex-col items-center gap-4">
                {["A", "B", "C"].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => handleAnswer(idx, opt)}
                    className={`w-full max-w-xs py-4 px-8 text-[20px] font-bold rounded-full shadow transition-all duration-200 border-2 ${
                      answers[startIndex + idx] === opt
                        ? "bg-[#f4a261] text-white border-[#f4a261]"
                        : "bg-white border-gray-300 text-gray-700 hover:bg-[#ffe3c3]"
                    }`}
                  >
                    {q["option" + opt]}
                  </button>
                ))}
              </div>
            </div>
          );
        })}

        <div className="flex justify-center mt-6">
          <button
            onClick={handleNext}
            className="bg-[#f4a261] hover:bg-[#e57d23] text-white text-xl font-semibold py-4 px-10 rounded-full shadow"
          >
            {startIndex + QUESTIONS_PER_PAGE >= questions.length ? "診断結果を見る" : "次へ"}
          </button>
        </div>
      </div>
    </div>
  );
}
