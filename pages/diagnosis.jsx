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
    if ((page + 1) * QUESTIONS_PER_PAGE >= questions.length) {
      const type = calculateType(answers);
      const typeToUrl = {
        ISTJ: "/result-16type-test",
        ISFJ: "/result-16type-test",
        INFJ: "/result-16type-test",
        INTJ: "/result-16type-test",
        ISTP: "/result-16type-test",
        ISFP: "/result-16type-test",
        INFP: "/result-16type-test",
        INTP: "/result-16type-test",
        ESTP: "/result-16type-test",
        ESFP: "/result-16type-test",
        ENFP: "/result-16type-test",
        ENTP: "/result-16type-test",
        ESTJ: "/result-16type-test",
        ESFJ: "/result-16type-test",
        ENFJ: "/result-16type-test",
        ENTJ: "/result-16type-test",
      };
      const resultUrl = typeToUrl[type] || "/result-16type-test";
      router.push(resultUrl + `?type=${type}`);
    } else {
      setPage(page + 1);
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
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-white text-gray-800">
      <div className="w-full max-w-2xl">
        <div className="mb-6">
          <div className="flex justify-between mb-2 text-sm text-gray-500">
            <span>進捗 {progress}%</span>
            <span>{startIndex + 1} / {questions.length} 問</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full">
            <div
              className="h-2 bg-green-500 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {currentQuestions.map((q, idx) => (
          <div key={q.id} className="mb-6 p-4 bg-gray-50 rounded-xl shadow-sm">
            <p className="text-sm text-gray-500 mb-1">Q{startIndex + idx + 1}</p>
            <p className="font-semibold mb-3">{q.question}</p>
            <div className="flex flex-col gap-2">
              {["A", "B", "C"].map((opt) => {
                const isSelected = answers[startIndex + idx] === opt;
                return (
                  <button
                    key={opt}
                    onClick={() => handleAnswer(idx, opt)}
                    className={`py-2 px-4 rounded-lg border text-left transition hover:bg-green-50 ${
                      isSelected ? "bg-green-100 border-green-500 font-bold" : "bg-white border-gray-300"
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
          <button
            onClick={handleNext}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-xl"
          >
            {startIndex + QUESTIONS_PER_PAGE >= questions.length ? "診断結果を見る" : "次へ"}
          </button>
        </div>
      </div>
    </div>
  );
}
