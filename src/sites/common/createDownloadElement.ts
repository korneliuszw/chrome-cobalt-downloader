
type ElementSelector<T = Element> = string | ((element: T) => Element | null)


export type DownloadNodeCreatorFunction = ((item: Element, container: Element, downloadHandler: (ev: MouseEvent) => void) => void)

interface ICreateDownloadElement {
    itemSelector: ElementSelector<Element>
    downloadElementSelector: ElementSelector<Element>
    downloadEventName: string
    elementCreator: string | DownloadNodeCreatorFunction
    downloadPageSelector: ElementSelector<Element>
    itemContainerSelector: ElementSelector<Element>
}

const getSelector = <T extends Element>(root: T, selector: ElementSelector<T>) => {
    let element: Element | null;
    if (typeof selector === 'string') {
        element = root.querySelector(selector)
    } else {
        element = selector(root)
    }
    return element
}

const injectDownloadElement = (item: Element, selector: ElementSelector, elementCreator: ICreateDownloadElement['elementCreator'], downloadHandler: (event: MouseEvent) => void) => {
    const element = getSelector(item, selector)
    if (!element) {
        console.error('Failed to find download element anchor. It is possible that site has changed its layout. Please submit a PR to github repository if you believe thats the case.')
        return
    }
    if (element.querySelector('.downloader-btn')) {
        return
    }
    if (typeof elementCreator === 'string') {
        // create new element for downloads from html
        const downloadElement = document.createElement('div')
        downloadElement.innerHTML = elementCreator
        downloadElement.classList.add('downloader-btn')
        downloadElement.addEventListener('click', downloadHandler)
        element.appendChild(downloadElement)
    } else {
        elementCreator(item, element, downloadHandler)
    }
}
const onDownloadClicked = (item: Element, downloadPageSelector: ElementSelector, _event: MouseEvent) => {
    const selector = getSelector(item, downloadPageSelector)
    if (!selector) {
        console.error('Failed to find URL of item to download. It is possible that site has changed its layout. Please submit a PR to github repository if you believe thats the case.')
        return
    }
    const url = selector.getAttribute('href')!
    console.log(url)
}

const setupItem = (item: Element, {downloadElementSelector, elementCreator, downloadPageSelector, downloadEventName}: Omit<ICreateDownloadElement, 'itemSelector' | 'itemContainerSelector'>) => {
    console.debug('injecting')
    injectDownloadElement(item, downloadElementSelector, elementCreator, onDownloadClicked.bind(null, item, downloadPageSelector))
}

let pageObserver: MutationObserver
let intersectionObserver: IntersectionObserver

export function stopObservingPage() {
    pageObserver?.disconnect()
    intersectionObserver?.disconnect()
}

const destroyItem = (item: Element) => {
    item.querySelector('.downloader-btn')?.remove()
}

export function createDownloadElement({itemSelector, itemContainerSelector, ...elementDetails}: ICreateDownloadElement) {
    stopObservingPage()
    const itemContainer = getSelector(document as unknown as Element, itemContainerSelector)
    if (!itemContainer) {
        console.error('Failed to a container with items. It is possible that site has changed its layout. Please submit a PR to github repository if you believe thats the case.')
        return
    }
    const intersectionCallback = (items: IntersectionObserverEntry[]) => {
        for (const visibleItem of items) {
            if (visibleItem.isIntersecting ) {
                setupItem(visibleItem.target, elementDetails)
            } else {
                destroyItem(visibleItem.target)
            }
        }
    }
    intersectionObserver = new IntersectionObserver(intersectionCallback, {threshold: [0.1]})
    const mutationCallback = () => {
        // there's no point keeping track as most sites uses infinite lists, let observer mechanism handle duplicates and GC
        // this might change however when i come across site which doesn't use infinite lists
        itemContainer.querySelectorAll(itemSelector).forEach(item => intersectionObserver.observe(item))
    } 
    pageObserver = new MutationObserver(mutationCallback)
    pageObserver.observe(itemContainer, {
        childList: true
    })
    mutationCallback()
}