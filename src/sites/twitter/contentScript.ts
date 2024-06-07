import { createDownloadElement } from "../common/createDownloadElement";
import { createDownloadNode } from "./downloadNode";

let observer = new MutationObserver(() => {
    createDownloadElement({
        itemContainerSelector: '[data-testid=primaryColumn] section[role=region] > div > div',
        itemSelector: 'article:has([data-testid=videoPlayer])',
        downloadElementSelector: '[role=group]',
        elementCreator: '<div>test</div>',
        downloadEventName: 'twitter-download-new',
        downloadPageSelector: '[data-testid="User-Name"] > div:nth-of-type(2) > div > div:nth-of-type(3) a[role=link]'
    })
})
observer.observe(document.body, {
    childList: true
})

