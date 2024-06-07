import { createDownloadElement } from "../common/createDownloadElement";

let observer = new MutationObserver(() => {
    createDownloadElement({
        itemContainerSelector: '[data-testid=primaryColumn] section[role=region] > div > div',
        // get only elements with video player
        // also skip ads because they won't download as well, they are somewhat identifiable by card.wrapper
        itemSelector: 'article:has([data-testid=videoPlayer]):not(:has([data-testid="card.wrapper"]))',
        downloadElementSelector: '[role=group]',
        elementCreator: '<div>download</div>',
        downloadEventName: 'cobalt-download',
        downloadPageSelector: 'a[role=link][href*=status]'
    })
})
observer.observe(document.head, {
    childList: true
})

