import { getStore } from 'Application/Env';

type TElement = (Element & { isScrollOnBody?: true }) | null;

export function getScrollContentElement(content: Element): TElement {
    let scrollContent: TElement | null = content.closest('.controls-Scroll-ContainerBase__content');
    // делаем 2 проверки чтобы не вызывать getBoundingClientRect лишний раз
    if (getStore('AdaptiveInitializer').get('isScrollOnBody')) {
        const windowHeight = window.screen.height;
        const scrollContainer = content.closest('.controls-Scroll-Container');
        // высота самого Controls.scroll:Container может быть фиксирована, например в SlidingPanel
        if (
            scrollContent &&
            scrollContainer &&
            scrollContent.getBoundingClientRect().height > windowHeight &&
            scrollContainer.scrollHeight > windowHeight
        ) {
            // помечаем конейнер как скролируемый на боди
            if (!scrollContent.isScrollOnBody) {
                scrollContent.isScrollOnBody = true;
            }
            scrollContent = document.scrollingElement;
        }
        // высоту мастерскролла поменяли на 0, например при поиске, но мы должны продолжать скролить боди
        if (scrollContent && scrollContent.isScrollOnBody) {
            scrollContent = document.scrollingElement;
        }
    }
    return scrollContent;
}
