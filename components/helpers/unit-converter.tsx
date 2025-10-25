"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

const conversions: Record<string, Record<string, number>> = {
  volume: {
    ml: 1,
    l: 1000,
    tsp: 4.92892,
    tbsp: 14.7868,
    "fl oz": 29.5735,
    cup: 236.588,
  },
  weight: {
    g: 1,
    kg: 1000,
    oz: 28.3495,
    lb: 453.592,
  },
}

export default function UnitConverter() {
  const [category, setCategory] = useState<"volume" | "weight">("volume")
  const [value, setValue] = useState(1)
  const [fromUnit, setFromUnit] = useState("cup")
  const [toUnit, setToUnit] = useState("ml")

  const units = Object.keys(conversions[category])

  const convert = () => {
    const fromValue = conversions[category][fromUnit]
    const toValue = conversions[category][toUnit]
    return ((value * fromValue) / toValue).toFixed(2)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-amber-900 mb-6">Unit Converter</h2>

        {/* Category Selector */}
        <div className="flex gap-4 mb-6">
          <Button
            onClick={() => {
              setCategory("volume")
              setFromUnit("cup")
              setToUnit("ml")
            }}
            className={`${
              category === "volume"
                ? "bg-amber-600 hover:bg-amber-700 text-white"
                : "bg-white border-2 border-amber-200 text-amber-900 hover:bg-amber-50"
            }`}
          >
            Volume
          </Button>
          <Button
            onClick={() => {
              setCategory("weight")
              setFromUnit("g")
              setToUnit("oz")
            }}
            className={`${
              category === "weight"
                ? "bg-amber-600 hover:bg-amber-700 text-white"
                : "bg-white border-2 border-amber-200 text-amber-900 hover:bg-amber-50"
            }`}
          >
            Weight
          </Button>
        </div>

        {/* Converter */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-amber-900 mb-2">From</label>
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(Number(e.target.value))}
              className="w-full px-3 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="Enter amount"
            />
            <select
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
              className="w-full mt-2 px-3 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              {units.map((unit) => (
                <option key={unit} value={unit}>
                  {unit}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end justify-center pb-2">
            <div className="text-2xl font-bold text-amber-600">=</div>
          </div>

          <div>
            <label className="block text-sm font-medium text-amber-900 mb-2">To</label>
            <div className="w-full px-3 py-2 border border-amber-300 rounded-lg bg-amber-50 text-amber-900 font-semibold">
              {convert()}
            </div>
            <select
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value)}
              className="w-full mt-2 px-3 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              {units.map((unit) => (
                <option key={unit} value={unit}>
                  {unit}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}
