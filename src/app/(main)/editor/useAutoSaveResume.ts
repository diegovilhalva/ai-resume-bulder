import { useToast } from "@/hooks/use-toast";
import useDebounce from "@/hooks/useDebounce";
import { ResumeValues } from "@/lib/validation";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function useAutoSaveResume(resumeData: ResumeValues) {
    const searchParams = useSearchParams()

    const {toast} = useToast()
    const debouncedResumeData = useDebounce(resumeData, 1500)

    const [resumeId,setResumeId] = useState(resumeData.id)
    
    const [lastSavedData, setLastSavedData] = useState(
        structuredClone(resumeData)
    )

    const [isSaving, setIsSaving] = useState(false)

    useEffect(() => {
        async function save() {
            setIsSaving(true)
            await new Promise(resolve => setTimeout(resolve, 1500))
            setLastSavedData(structuredClone(debouncedResumeData))
            setIsSaving(false)
        }

        const hasUnsavedChanges = JSON.stringify(debouncedResumeData)
            !== JSON.stringify(lastSavedData)

        if (hasUnsavedChanges && debouncedResumeData && !isSaving) {
            save()
        }

    }, [debouncedResumeData, isSaving, lastSavedData])

    return {
        isSaving,
        hasUnsavedChanges: JSON.stringify(resumeData) !== JSON.stringify(lastSavedData),

    }
}