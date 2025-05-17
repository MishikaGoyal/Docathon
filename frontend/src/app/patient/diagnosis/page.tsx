import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Breast Cancer Risk Assessment",
  description: "A professional tool to assess breast cancer risk factors",
};

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Breast Cancer Risk Assessment
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    This assessment tool helps identify potential risk factors
                    for breast cancer. Your responses are confidential and this
                    tool is not a substitute for professional medical advice.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/patient/diagnosis/assesment">
                    <Button size="lg" className="bg-pink-600 hover:bg-pink-700">
                      Start Assessment
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative h-[300px] w-[300px] sm:h-[400px] sm:w-[400px] lg:h-[500px] lg:w-[500px]">
                  <div className="absolute inset-0 rounded-full bg-pink-100 opacity-50 blur-3xl"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-3/4 w-3/4 rounded-full bg-pink-50 shadow-lg"></div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-pink-600">
                        Early Detection
                      </div>
                      <div className="mt-2 text-lg text-muted-foreground">
                        Saves Lives
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Disclaimer: This tool is for informational purposes only and is not
            a substitute for professional medical advice.
          </p>
        </div>
      </footer>
    </div>
  );
}
