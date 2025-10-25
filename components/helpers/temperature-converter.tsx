"use client"

import { useState } from "react"

export default function TemperatureConverter() {
  const [celsius, setCelsius] = useState(200)
  const [fahrenheit, setFahrenheit] = useState(392)

  const handleCelsiusChange = (value: number) => {
    setCelsius(value)
    setFahrenheit(Math.round((value * 9) / 5 + 32))
  }

  const handleFahrenheitChange = (value: number) => {
    setFahrenheit(value)
    setCelsius(Math.round(((value - 32) * 5) / 9))
  }

  const commonTemps = [
    { c: 160, f: 320, label: "Low" },
    { c: 180, f: 356, label: "Medium-Low" },
    { c: 200, f: 392, label: "Medium" },
    { c: 220, f: 428, label: "Medium-High" },
    { c: 240, f: 464, label: "High" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-amber-900 mb-6">Temperature Converter</h2>

        {/* Converter */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <label className="block text-sm font-medium text-amber-900 mb-2">Celsius</label>
            <input
              type="number"
              value={celsius}
              onChange={(e) => handleCelsiusChange(Number(e.target.value))}
              className="w-full px-4 py-3 text-2xl border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <p className="text-sm text-amber-600 mt-2">°C</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-amber-900 mb-2">Fahrenheit</label>
            <input
              type="number"
              value={fahrenheit}
              onChange={(e) => handleFahrenheitChange(Number(e.target.value))}
              className="w-full px-4 py-3 text-2xl border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <p className="text-sm text-amber-600 mt-2">°F</p>
          </div>
        </div>

        {/* Common Temperatures */}
        <div>
          <h3 className="text-lg font-semibold text-amber-900 mb-4">Common Oven Temperatures</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
            {commonTemps.map((temp) => (
              <button
                key={temp.c}
                onClick={() => handleCelsiusChange(temp.c)}
                className="p-4 bg-amber-50 border-2 border-amber-200 rounded-lg hover:bg-amber-100 transition-colors text-center"
              >
                <p className="font-semibold text-amber-900">{temp.label}</p>
                <p className="text-sm text-amber-700">{temp.c}°C</p>
                <p className="text-sm text-amber-600">{temp.f}°F</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
