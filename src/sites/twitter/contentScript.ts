import { createDownloadElement } from "../common/createDownloadElement";

let observer = new MutationObserver(() => {
    createDownloadElement({
        itemContainerSelector: '[data-testid=primaryColumn] section[role=region] > div > div',
        itemSelector: 'article:has([data-testid=videoPlayer])',
        downloadElementSelector: '[role=group]',
        elementCreator: '<div>download</div>',
        downloadEventName: 'cobalt-download',
        downloadPageSelector: 'a[role=link][href*=status]'
    })
})
observer.observe(document.body, {
    childList: true
})

