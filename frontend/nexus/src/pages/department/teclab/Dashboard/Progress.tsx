"use client"
import * as React from "react"
import { Progress } from "@/components/ui/progress"

export function ProgressDemo({ title, min, max, val }) {
  const [progress, setProgress] = React.useState(0)

  React.useEffect(() => {
    // Calculate the percentage within the given range
    const calculatePercentage = () => {
      // Handle edge cases
      if (max === min) return 100;

      // Calculate what percentage of the range the current value represents
      const percentage = ((val - min) / (max - min)) * 100;

      // Ensure the percentage is between 0 and 100
      return Math.max(0, Math.min(100, percentage));
    };

    // Set initial progress to 0, then animate to the calculated percentage
    const timer = setTimeout(() => setProgress(calculatePercentage()), 500);
    return () => clearTimeout(timer);
  }, [min, max, val]);

  return (
    <>
      <div className="flex flex-col w-full m-2">
        <div className="flex justify-between text-xs pb-1">
          <span>{min}</span>
          <p className="text-center font-medium">{title}</p>
          <span>{max}</span>
        </div>
        <Progress
          value={progress}
          className="w-[100%] bg-blue-100"
          indicatorColor="bg-blue-600"
        />
        <div className="text-xs text-center mt-1">
          {val}
        </div>
      </div>
    </>
  )
}


/*
"use client"

import * as React from "react"

import { Progress } from "@/components/ui/progress"

export function ProgressDemo({ title, min, max, val }) {
  const [progress, setProgress] = React.useState(13)

  React.useEffect(() => {
    const timer = setTimeout(() => setProgress(val), 500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      <div className="flex flex-col w-full m-2">
        <p className="pb-2 text-xs text-center">{title}</p>
        <Progress
          value={val}
          className="w-[100%] bg-blue-100"
          indicatorColor="bg-blue-600" />
      </div >
    </>
  )
}

*/

