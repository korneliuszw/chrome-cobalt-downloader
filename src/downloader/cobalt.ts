import { GENERAL_DOWNLOAD_FAILURE, RATE_LIMIT_ERROR } from "../constants"

const COBALT_API_URL = 'https://api.cobalt.tools'

export const cobaltDownload = async (url: string) => {
    const response = await fetch(`${COBALT_API_URL}/api/json`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            url,
            twitterGif: true
        })
    })
    if (response.status >= 500)
        throw new Error(GENERAL_DOWNLOAD_FAILURE)
    const body = await response.json().catch(() => {status: 'error'})
    let error
    switch (body.status) {
        case 'rate-limit':
            error = RATE_LIMIT_ERROR
            break
        case 'error':
            error = body.text ?? GENERAL_DOWNLOAD_FAILURE
            break
    }
    if (error || !body.url)
        throw new Error(error ?? GENERAL_DOWNLOAD_FAILURE)
    await chrome.downloads.download({
        url: body.url
    })
}