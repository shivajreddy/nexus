"use client"

import * as React from "react"

import { Progress } from "@/components/ui/progress"

export function LoadingProgress() {
    const [progress, setProgress] = React.useState(13)

    React.useEffect(() => {
        const timer = setTimeout(() => setProgress(36), 500)
        return () => clearTimeout(timer)
    }, [])
    React.useEffect(() => {
        const timer = setTimeout(() => setProgress(100), 1000)
        return () => clearTimeout(timer)
    }, [])

    return <Progress value={progress} className="w-[60%]" />
}