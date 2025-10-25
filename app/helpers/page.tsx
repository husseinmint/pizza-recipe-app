"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, Zap, Scale, Thermometer } from "lucide-react"
import TimerHelper from "@/components/helpers/timer-helper"
import UnitConverter from "@/components/helpers/unit-converter"
import IngredientScaler from "@/components/helpers/ingredient-scaler"
import TemperatureConverter from "@/components/helpers/temperature-converter"

export default function HelpersPage() {
  const [activeHelper, setActiveHelper] = useState<"timer" | "units" | "scaler" | "temperature">("timer")

  const helpers = [
    { id: "timer", label: "Timer", icon: Clock, description: "Track cooking times" },
    { id: "units", label: "Unit Converter", icon: Zap, description: "Convert measurements" },
    { id: "scaler", label: "Ingredient Scaler", icon: Scale, description: "Scale recipes" },
    { id: "temperature", label: "Temperature", icon: Thermometer, description: "Convert temps" },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      {/* Header */}
      <header className="bg-white border-b border-amber-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div>
            <h1 className="text-4xl font-bold text-amber-900">Kitchen Helpers</h1>
            <p className="text-amber-700 mt-1">Useful tools for your cooking</p>
          </div>
        </div>
      </header>

      {/* Helper Selector */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {helpers.map((helper) => {
            const Icon = helper.icon
            const isActive = activeHelper === helper.id
            return (
              <Button
                key={helper.id}
                onClick={() => setActiveHelper(helper.id as any)}
                className={`h-auto py-4 flex flex-col items-center gap-2 ${
                  isActive
                    ? "bg-amber-600 hover:bg-amber-700 text-white"
                    : "bg-white border-2 border-amber-200 text-amber-900 hover:bg-amber-50"
                }`}
              >
                <Icon size={24} />
                <div className="text-center">
                  <p className="font-semibold">{helper.label}</p>
                  <p className="text-xs opacity-75">{helper.description}</p>
                </div>
              </Button>
            )
          })}
        </div>
      </section>

      {/* Helper Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <Card className="bg-white border-amber-200 p-8">
          {activeHelper === "timer" && <TimerHelper />}
          {activeHelper === "units" && <UnitConverter />}
          {activeHelper === "scaler" && <IngredientScaler />}
          {activeHelper === "temperature" && <TemperatureConverter />}
        </Card>
      </section>
    </main>
  )
}
