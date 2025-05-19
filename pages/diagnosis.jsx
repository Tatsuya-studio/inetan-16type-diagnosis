import { useState } from "react";
import { useRouter } from "next/router";
import { questions } from "../data/questions";

export default function Diagnosis() {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const router = useRouter();

  const calculateType = (answers) => {
    const axisCount = {
      EI: 0,
      SN: 0,
      TF: 0,
      JP: 0,
    };

    answers.forEach((answer, index) => {
      const q = questions[index];
      if (q.axis) {
        axisCount[q.axis] += answer === "A" ? 1 : -1;
      }
    });

    const type =
      (axisCount.EI >= 0 ? "E" : "I") +
      (axisCount.SN >= 0 ? "S" : "N") +
      (axisCount.TF >= 0 ? "T" : "F") +
      (axisCount.JP >= 0 ? "J" : "P");

    return type;
  };

  const handleAnswer = (choice) => {
    const updatedAnswers = [...answers, choice];
    setAnswers(updatedAnswers);

    if (current + 1 < questions.length) {
      setCurrent(current + 1);
    } else {
      const type = calculateType(updatedAnswers);

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
    }
  };

  const progress = Math.round(((current + 1) / questions.length) * 100);
  const q = questions[current];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-50 text-gray-800">
      <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-lg">
        <div className="mb-4">
          <div className="text-sm text-gray-500 mb-1">
            質問 {current + 1} / {questions.length}
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full">
            <div
              className="h-2 bg-blue-500 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <h2 className="text-lg font-semibold mb-6">{q.question}</h2>

        <div className="space-y-4">
          <button
            onClick={() => handleAnswer("A")}
            className="w-full bg-blue-100 hover:bg-blue-200 text-blue-900 font-medium py-3 rounded-xl transition"
          >
            {q.optionA}
          </button>
          <button
            onClick={() => handleAnswer("B")}
            className="w-full bg-pink-100 hover:bg-pink-200 text-pink-900 font-medium py-3 rounded-xl transition"
          >
            {q.optionB}
          </button>
        </div>
      </div>
    </div>
  );
}
