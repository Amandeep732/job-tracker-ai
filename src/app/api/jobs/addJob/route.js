export async function POST(request) {
    const {
        user,
        jobLocation,
        notes,
        jobTitle,
        companyName,
        jobDesc,
        reminderDate,
        resumeFile,
        status,
        AiSummary,
        AiTips,
        AiMatchScore

    } = await request.json()


    
}