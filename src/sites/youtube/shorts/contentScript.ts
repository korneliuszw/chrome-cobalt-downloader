import { createDownloadElement } from "../../common/createDownloadElement";

let observer = new MutationObserver(() => {
    createDownloadElement({
        itemContainerSelector: '#shorts-inner-container',
        // get only elements with video player
        // also skip ads because they won't download as well, they are somewhat identifiable by card.wrapper
        itemSelector: 'ytd-reel-video-renderer',
        downloadElementSelector: '#actions',
        elementCreator: '<div style="color: white;">download</div>',
        downloadEventName: 'cobalt-download',
        downloadPageSelector: 'a[data-sessionlink="feature=player-title"]'
    })
})
observer.observe(document.head, {
    childList: true
})

