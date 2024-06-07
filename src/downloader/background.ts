import { GENERAL_DOWNLOAD_FAILURE } from "../constants"
import { cobaltDownload } from "./cobalt"

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    console.log(request, sender, sendResponse)
    if (request.event === 'cobalt-download') {
        cobaltDownload(request.url)
            .then(() => sendResponse({status: 'done'}))
            .catch(err => sendResponse({status: 'error', message: err.message ?? GENERAL_DOWNLOAD_FAILURE}))
    }
    // true to make chrome wait for async
    return true
})