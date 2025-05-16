"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle, ArrowLeft, CalendarCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ResultsPage() {
  return (
    <div className="container mx-auto max-w-4xl py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="border-green-100 shadow-lg">
          <CardHeader className="bg-green-50 text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100"
            >
              <CheckCircle className="h-8 w-8 text-green-600" />
            </motion.div>
            <CardTitle className="text-2xl font-bold text-green-700">
              Low Risk Assessment
            </CardTitle>
            <CardDescription className="text-base">
              Based on your responses, you appear to have a lower risk profile
              for breast cancer.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            <div className="rounded-lg bg-green-50 p-4">
              <h3 className="mb-2 font-semibold text-green-700">
                What this means:
              </h3>
              <p className="text-muted-foreground">
                Your answers suggest you have fewer known risk factors for
                breast cancer. However, it's important to remember that all
                women are at risk for breast cancer, and regular screening is
                still important.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Recommended Next Steps:</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="mr-3 mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-green-100">
                    <div className="h-2 w-2 rounded-full bg-green-600"></div>
                  </div>
                  <div>
                    <span className="font-medium">
                      Continue with regular screenings
                    </span>
                    <p className="text-sm text-muted-foreground">
                      Follow age-appropriate screening guidelines as recommended
                      by your healthcare provider.
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="mr-3 mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-green-100">
                    <div className="h-2 w-2 rounded-full bg-green-600"></div>
                  </div>
                  <div>
                    <span className="font-medium">
                      Maintain a healthy lifestyle
                    </span>
                    <p className="text-sm text-muted-foreground">
                      Regular exercise, maintaining a healthy weight, and
                      limiting alcohol can help reduce breast cancer risk.
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="mr-3 mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-green-100">
                    <div className="h-2 w-2 rounded-full bg-green-600"></div>
                  </div>
                  <div>
                    <span className="font-medium">Be aware of changes</span>
                    <p className="text-sm text-muted-foreground">
                      Know how your breasts normally look and feel and report
                      any changes to your healthcare provider.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 bg-gray-50 p-6 sm:flex-row sm:justify-between sm:space-y-0">
            <Link href="/">
              <Button variant="outline" className="w-full sm:w-auto">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Return Home
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </motion.div>

      <div className="mt-8 text-center text-sm text-muted-foreground">
        <p>
          Disclaimer: This assessment is for informational purposes only and is
          not a substitute for professional medical advice. Please consult with
          a healthcare provider for personalized recommendations.
        </p>
      </div>
    </div>
  );
}
