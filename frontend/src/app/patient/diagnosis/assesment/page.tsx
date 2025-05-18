"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import i18n from "@/lib/i18n"; // Adjust if your i18n.ts is in a different folder

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";

type AnswerKey =
  | "age"
  | "hasLump"
  | "lumpHardness"
  | "lumpSurface"
  | "lumpSizeChange"
  | "sizeIncreaseRate"
  | "neckNodules"
  | "weightLoss"
  | "decreasedAppetite"
  | "shape";

type Answers = Record<AnswerKey, string>;

export default function AssessmentPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<Answers>({
    age: "",
    hasLump: "",
    lumpHardness: "",
    lumpSurface: "",
    lumpSizeChange: "",
    sizeIncreaseRate: "",
    neckNodules: "",
    weightLoss: "",
    decreasedAppetite: "",
    shape: "",
  });
  const [riskScore, setRiskScore] = useState(0);

  const totalSteps = 3;
  const progress = (step / totalSteps) * 100;

  const handleAnswerChange = (question: AnswerKey, value: string) => {
    const newAnswers = { ...answers, [question]: value };
    setAnswers(newAnswers);

    let newScore = 0;
    if (newAnswers.hasLump === "yes") newScore += 2;
    if (newAnswers.lumpHardness === "yes") newScore += 2;
    if (newAnswers.lumpSurface === "yes") newScore += 2;
    if (newAnswers.lumpSizeChange === "yes") newScore += 2;
    if (newAnswers.sizeIncreaseRate === "rapid") newScore += 1;
    if (newAnswers.sizeIncreaseRate === "slow") newScore += 2;
    if (newAnswers.neckNodules === "yes") newScore += 1;
    if (newAnswers.weightLoss === "yes") newScore += 1;
    if (newAnswers.decreasedAppetite === "yes") newScore += 1;
    if (newAnswers.shape === "yes") newScore += 5;

    setRiskScore(newScore);
  };

  const nextStep = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      if (riskScore >= 5) {
        router.push("/patient/diagnosis/assesment/detailed-result");
      } else if (riskScore >= 3) {
        router.push("/patient/diagnosis/assesment/results");
      } else {
        router.push("/patient/diagnosis/assesment/safe");
      }
    }
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const shouldShowQuestion = (questionId: AnswerKey): boolean => {
    if (questionId === "age") return true;
    if (
      step === 2 &&
      ["neckNodules", "weightLoss", "decreasedAppetite", "shape"].includes(
        questionId
      )
    ) {
      return true;
    }
    if (questionId === "hasLump") return step === 1;
    if (questionId === "lumpHardness")
      return answers.hasLump === "yes" && step === 1;
    if (questionId === "lumpSurface")
      return answers.lumpHardness === "yes" && step === 1;
    if (questionId === "lumpSizeChange")
      return answers.lumpSurface === "yes" && step === 1;
    if (questionId === "sizeIncreaseRate")
      return answers.lumpSizeChange === "yes" && step === 1;
    return false;
  };

  const isStepComplete = () => {
    if (step === 1) {
      if (answers.hasLump === "no") return true;
      if (answers.hasLump === "yes" && !answers.lumpHardness) return false;
      if (answers.lumpHardness === "yes" && !answers.lumpSurface) return false;
      if (answers.lumpSurface === "yes" && !answers.lumpSizeChange)
        return false;
      if (answers.lumpSizeChange === "yes" && !answers.sizeIncreaseRate)
        return false;
      return true;
    }
    if (step === 2) {
      return (
        answers.neckNodules &&
        answers.weightLoss &&
        answers.decreasedAppetite &&
        answers.shape
      );
    }
    return true;
  };

  const getCurrentQuestions = () => {
    const allQuestions = [
      {
        id: "hasLump",
        imageUrl: "",
        options: ["yes", "no"],
      },
      {
        id: "lumpHardness",
        imageUrl: "",
        options: ["yes", "no"],
      },
      {
        id: "lumpSurface",
        imageUrl: "",
        options: ["yes", "no"],
      },
      {
        id: "lumpSizeChange",
        imageUrl: "",
        options: ["yes", "no"],
      },
      {
        id: "sizeIncreaseRate",
        imageUrl: "",
        options: ["rapid", "slow"],
      },
      {
        id: "neckNodules",
        imageUrl: "",
        options: ["yes", "no"],
        step: 2,
      },
      {
        id: "weightLoss",
        imageUrl: "",
        options: ["yes", "no"],
        step: 2,
      },
      {
        id: "decreasedAppetite",
        imageUrl: "",
        options: ["yes", "no"],
        step: 2,
      },
      {
        id: "shape",
        imageUrl: "https://i.ytimg.com/vi/G0TKXaOXrik/sddefault.jpg",
        options: ["yes", "no"],
        step: 2,
      },
    ];

    return allQuestions.filter((q) => {
      if (q.step && q.step !== step) return false;
      return shouldShowQuestion(q.id as AnswerKey);
    });
  };

  return (
    <div className="container mx-auto max-w-4xl py-8 px-4">
      <div className="flex justify-end mb-4">
        <select
          value={i18n.language}
          onChange={(e) => i18n.changeLanguage(e.target.value)}
          className="rounded border px-2 py-1 text-sm text-pink-700"
        >
          <option value="en">English</option>
          <option value="hi">हिंदी</option>
          <option value="kn">ಕನ್ನಡ</option>
        </select>
      </div>

      <div className="mb-8 space-y-4">
        <h1 className="text-center text-3xl font-bold text-pink-700">
          {t("assessment.title")}
        </h1>
        <p className="text-center text-muted-foreground">
          {t("assessment.description")}
        </p>
        <div className="mx-auto w-full max-w-md">
          <Progress value={progress} className="h-2 bg-pink-100" />
          <div className="mt-2 flex justify-between text-sm text-muted-foreground">
            <span>
              Step {step} of {totalSteps}
            </span>
            <span>Risk Indicators: {riskScore}</span>
          </div>
        </div>
      </div>

      <motion.div
        key={step}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="border-pink-100 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-pink-700">
              {t(`assessment.steps.${step}`)}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            {getCurrentQuestions().map((q) => (
              <div key={q.id} className="space-y-3">
                <Label htmlFor={q.id} className="text-base">
                  {t(`assessment.questions.${q.id}`)}
                </Label>
                {q.imageUrl && (
                  <img
                    src={q.imageUrl}
                    alt="Question visual"
                    className="w-full max-w-md rounded-lg border shadow-sm"
                  />
                )}

                <RadioGroup
                  id={q.id}
                  value={answers[q.id as AnswerKey]}
                  onValueChange={(value) =>
                    handleAnswerChange(q.id as AnswerKey, value)
                  }
                  className="grid grid-cols-1 gap-3 md:grid-cols-2"
                >
                  {q.options.map((value) => (
                    <div
                      key={value}
                      className={`flex items-center space-x-2 rounded-md border p-3 transition-colors ${
                        answers[q.id as AnswerKey] === value
                          ? "border-pink-300 bg-pink-50"
                          : "hover:bg-muted"
                      }`}
                    >
                      <RadioGroupItem value={value} id={`${q.id}-${value}`} />
                      <Label
                        htmlFor={`${q.id}-${value}`}
                        className="flex-1 cursor-pointer"
                      >
                        {t(`assessment.options.${value}`)}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            ))}
          </CardContent>

          <div className="flex justify-between p-6 border-t">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={step === 1}
              className="gap-2 border-pink-200 text-pink-700 hover:bg-pink-50"
            >
              <ArrowLeft className="h-4 w-4" />
              Previous
            </Button>
            <Button
              onClick={nextStep}
              disabled={!isStepComplete()}
              className="gap-2 bg-pink-600 hover:bg-pink-700"
            >
              {step === totalSteps ? "Get Results" : "Next"}
              {step !== totalSteps && <ArrowRight className="h-4 w-4" />}
            </Button>
          </div>
        </Card>
      </motion.div>

      <div className="mt-8 text-center text-sm text-muted-foreground">
        <p>
          This assessment is not a diagnostic tool. Please consult with a
          healthcare professional for medical advice.
        </p>
      </div>
    </div>
  );
}
