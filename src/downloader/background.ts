import { GENERAL_DOWNLOAD_FAILURE } from "../constants"
import { cobaltDownload } from "./cobalt"

chrome.runtime.onMessage.addListener(async function (request, sender, sendResponse) {
    console.log(request, sender, sendResponse)
    if (request.event === 'cobalt-download') {
        try {
            await cobaltDownload(request.url)
            sendResponse({status: 'done'})
        } catch (err) {
            sendResponse({status: 'error', message: err.message ?? GENERAL_DOWNLOAD_FAILURE})
        }
    }
})