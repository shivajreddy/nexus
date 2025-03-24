"use client"
import * as React from "react"
import { Progress } from "@/components/ui/progress"

export function ProgressDemo({ title, count, user_min, user_max, min, max, val }) {
    const [progress, setProgress] = React.useState(0)

    // Function to determine color based on value percentage
    const getColorForValue = (val, min, max) => {
        // Calculate percentage of the value within the range
        const percentage = ((val - min) / (max - min)) * 100
        // console.log("-----------------------");
        // console.log(val, min, max, percentage);

        // Define color thresholds (adjust these as needed)
        if (percentage <= 25) return "bg-green-500"
        if (percentage <= 50) return "bg-blue-500"
        if (percentage <= 75) return "bg-yellow-500"
        if (percentage <= 100) return "bg-orange-500"
        return "bg-red-700"
    }

    React.useEffect(() => {
        // Calculate the percentage within the given range
        const calculatePercentage = () => {
            // Handle edge cases
            if (user_max === user_min) return 100;

            // Calculate what percentage of the range the current value represents
            const percentage = ((val - user_min) / (user_max - user_min)) * 100;

            // Ensure the percentage is between 0 and 100
            return Math.max(0, Math.min(100, percentage));
        };

        // Set initial progress to 0, then animate to the calculated percentage
        const timer = setTimeout(() => setProgress(calculatePercentage()), 500);
        return () => clearTimeout(timer);
    }, [user_min, user_max, val]);

    // Get the appropriate color class
    const indicatorColor = getColorForValue(val, user_min, user_max)

    const Scale = ({ min, max }) => (
        <div className="mt-1 w-full flex flex-col">
            <div className="flex justify-between">
                {[...Array(11)].map((_, i) => (
                    <div
                        key={i}
                        className={`
 ${i % 5 === 0 && (i === 0 || i === 10) ? 'border-l-2 border-gray-400 h-2.5' : 'border-l border-dashed border-gray-400 h-1.5'}
          `}
                    />
                ))}
            </div>
            <div className="border-t border-dashed border-gray-400 -mt-px w-full" />
            <div className="flex justify-between pt-1">
                <span className="text-xs text-gray-500">{min}</span>
                <span className="text-xs text-gray-500">{max}</span>
            </div>
        </div>
    );

    return (
        <>
            <div className="flex flex-col w-full m-2">
                <p className="text-center font-medium flex flex-col mb-2">
                    <span className="uppercase">{title}</span>
                    <span className="text-xs pl-2 uppercase text-gray-500"> Total Projects:{count} </span>
                </p>
                <div className="flex items-center justify-between  text-xs pb-1 px-2">
                    <div className="flex flex-col">
                        <span className="inline-block px-2 py-1 rounded-sm bg-gray-100 border border-gray-300 text-xs text-black">
                            {min}
                        </span>
                        <span className="text-xs text-gray-500">MIN</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="inline-block px-2 py-1 rounded-sm bg-gray-100 border border-gray-300 text-sm text-black">
                            {val}
                        </span>
                        <span className="text-xs text-gray-500">AVG</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="inline-block px-2 py-1 rounded-sm bg-gray-100 border border-gray-300 text-xs text-black">
                            {max}
                        </span>
                        <span className="text-xs text-gray-500">MAX</span>
                    </div>
                </div>
                <Progress
                    value={progress}
                    className="w-[100%] bg-blue-100"
                    indicatorColor={indicatorColor}
                />
                {/* <div className="flex justify-between text-xs pb-1 px-2"> */}
                {/*     <span>{user_min}</span> */}
                {/*     {val} */}
                {/*     <span>{user_max}</span> */}
                {/* </div> */}
                <Scale min={user_min} max={user_max} />
            </div>
        </>
    )
}

