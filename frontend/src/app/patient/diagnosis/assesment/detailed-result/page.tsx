"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { AlertCircle, ArrowLeft, CalendarCheck, PhoneCall } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function DetailedResultsPage() {
  return (
    <div className="container mx-auto max-w-4xl py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="border-amber-100 shadow-lg">
          <CardHeader className="bg-amber-50 text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100"
            >
              <AlertCircle className="h-8 w-8 text-amber-600" />
            </motion.div>
            <CardTitle className="text-2xl font-bold text-amber-700">
              Elevated Risk Factors Identified
            </CardTitle>
            <CardDescription className="text-base">
              Based on your responses, you have some risk factors that may be
              associated with an increased risk of breast cancer.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            <div className="rounded-lg bg-amber-50 p-4">
              <h3 className="mb-2 font-semibold text-amber-700">
                What this means:
              </h3>
              <p className="text-muted-foreground">
                Having risk factors does not mean you will develop breast
                cancer. It means it may be beneficial to discuss these factors
                with a healthcare provider to determine appropriate screening
                and prevention strategies.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Recommended Next Steps:</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="mr-3 mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-100">
                    <div className="h-2 w-2 rounded-full bg-amber-600"></div>
                  </div>
                  <div>
                    <span className="font-medium">
                      Consult with a healthcare provider
                    </span>
                    <p className="text-sm text-muted-foreground">
                      Share your risk assessment results with your doctor to
                      discuss personalized screening recommendations.
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="mr-3 mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-100">
                    <div className="h-2 w-2 rounded-full bg-amber-600"></div>
                  </div>
                  <div>
                    <span className="font-medium">
                      Consider enhanced screening
                    </span>
                    <p className="text-sm text-muted-foreground">
                      Your provider may recommend more frequent mammograms or
                      additional screening methods like breast MRI.
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="mr-3 mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-100">
                    <div className="h-2 w-2 rounded-full bg-amber-600"></div>
                  </div>
                  <div>
                    <span className="font-medium">
                      Discuss risk reduction strategies
                    </span>
                    <p className="text-sm text-muted-foreground">
                      There may be lifestyle changes or preventive medications
                      that could help reduce your risk.
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="mr-3 mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-100">
                    <div className="h-2 w-2 rounded-full bg-amber-600"></div>
                  </div>
                  <div>
                    <span className="font-medium">
                      Consider genetic counseling
                    </span>
                    <p className="text-sm text-muted-foreground">
                      If you have a family history of breast cancer, genetic
                      counseling and testing may be appropriate.
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
            <div className="flex w-full flex-col space-y-2 sm:w-auto sm:flex-row sm:space-x-2 sm:space-y-0"></div>
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
