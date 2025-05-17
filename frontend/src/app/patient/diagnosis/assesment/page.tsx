"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

    // Calculate risk score
    let newScore = 0;

    // High risk factors (2 points each)
    if (newAnswers.hasLump === "yes") newScore += 2;
    if (newAnswers.lumpHardness === "yes") newScore += 2;
    if (newAnswers.lumpSurface === "yes") newScore += 2;
    if (newAnswers.lumpSizeChange === "yes") newScore += 2;
    if (newAnswers.sizeIncreaseRate === "rapid") newScore += 1;
    if (newAnswers.sizeIncreaseRate === "slow") newScore += 2;

    // Moderate risk factors (1 point each)
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
      // Navigation based on risk score
      if (riskScore >= 5) {
        router.push("/patient/diagnosis/assesment/detailed-result");
      } else if (riskScore >= 3) {
        router.push("/patient/diagnosis/assesment/results");
      }
    }
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const shouldShowQuestion = (questionId: AnswerKey): boolean => {
    // Always show age question
    if (questionId === "age") return true;

    // Show general questions to everyone in step 2
    if (
      step === 2 &&
      ["neckNodules", "weightLoss", "decreasedAppetite", "shape"].includes(
        questionId
      )
    ) {
      return true;
    }

    // Lump-related questions conditional flow
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
    // Step 1 completion (lump-related questions)
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

    // Step 2 completion (general questions)
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
        question: "Have you noticed a lump in your breast?",
        options: [
          { value: "yes", label: "Yes" },
          { value: "no", label: "No" },
        ],
        isCritical: true,
      },
      {
        id: "lumpHardness",
        question: "Is the lump stony hard?",
        options: [
          { value: "yes", label: "Yes" },
          { value: "no", label: "No" },
        ],
        dependsOn: { id: "hasLump", value: "yes" },
      },
      {
        id: "lumpSurface",
        question: "Is the surface of the lump irregular?",
        options: [
          { value: "yes", label: "Yes" },
          { value: "no", label: "No" },
        ],
        dependsOn: { id: "lumpHardness", value: "yes" },
      },
      {
        id: "lumpSizeChange",
        question: "Has the lump increased in size in the past month?",
        options: [
          { value: "yes", label: "Yes" },
          { value: "no", label: "No" },
        ],
        dependsOn: { id: "lumpSurface", value: "yes" },
      },
      {
        id: "sizeIncreaseRate",
        question: "How fast has the size increased?",
        options: [
          { value: "rapid", label: "Rapidly (within weeks)" },
          { value: "slow", label: "Slowly (over months)" },
        ],
        dependsOn: { id: "lumpSizeChange", value: "yes" },
      },
      {
        id: "neckNodules",
        question: "Have you noticed any nodules in your neck?",
        options: [
          { value: "yes", label: "Yes" },
          { value: "no", label: "No" },
        ],
        step: 2,
      },
      {
        id: "weightLoss",
        question: "Have you experienced unexplained weight loss?",
        options: [
          { value: "yes", label: "Yes" },
          { value: "no", label: "No" },
        ],
        step: 2,
      },
      {
        id: "decreasedAppetite",
        question: "Are you experiencing decreased appetite?",
        options: [
          { value: "yes", label: "Yes" },
          { value: "no", label: "No" },
        ],
        step: 2,
      },
      {
        id: "shape",
        question:
          "Does your breast appear like an orange peel, like the image shown below",
        imageUrl:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ44zUk4Lg2V3P4CRM9v-dteyJXHVEsFKzABg&s",
        options: [
          { value: "yes", label: "Yes" },
          { value: "no", label: "No" },
        ],
        step: 2,
      },
    ];

    return allQuestions.filter((q) => {
      // Show questions for current step
      if (q.step && q.step !== step) return false;

      // Handle conditional questions
      if (q.dependsOn) {
        return answers[q.dependsOn.id as AnswerKey] === q.dependsOn.value;
      }

      return shouldShowQuestion(q.id as AnswerKey);
    });
  };

  return (
    <div className="container mx-auto max-w-4xl py-8 px-4">
      <div className="mb-8 space-y-4">
        <h1 className="text-center text-3xl font-bold text-pink-700">
          Breast Cancer Risk Assessment
        </h1>
        <p className="text-center text-muted-foreground">
          Please answer all questions to get an accurate risk assessment.
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
              {step === 1 && "Breast Lump Assessment"}
              {step === 2 && "General Symptoms"}
              {step === 3 && "Review Your Answers"}
            </CardTitle>
            <CardDescription>
              {step === 1 && "Tell us about any breast lumps you've noticed"}
              {step === 2 &&
                "Help us understand other symptoms you're experiencing"}
              {step === 3 && "Confirm your information before submitting"}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {getCurrentQuestions().map((q) => (
              <div key={q.id} className="space-y-3">
                <Label htmlFor={q.id} className="text-base">
                  {q.question}
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
                  {q.options.map((option) => (
                    <div
                      key={option.value}
                      className={`flex items-center space-x-2 rounded-md border p-3 transition-colors ${
                        answers[q.id as AnswerKey] === option.value
                          ? "border-pink-300 bg-pink-50"
                          : "hover:bg-muted"
                      }`}
                    >
                      <RadioGroupItem
                        value={option.value}
                        id={`${q.id}-${option.value}`}
                      />
                      <Label
                        htmlFor={`${q.id}-${option.value}`}
                        className="flex-1 cursor-pointer"
                      >
                        {option.label}
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
