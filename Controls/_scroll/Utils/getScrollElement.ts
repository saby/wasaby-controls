import { getStore } from 'Application/Env';

export function getScrollContentElement(content: Element): Element {
    let scrollContent = content.closest('.controls-Scroll-ContainerBase__content');
    // делаем 2 проверки чтобы не вызывать getBoundingClientRect лишний раз
    if (getStore('AdaptiveInitializer').get('isScrollOnBody')) {
        const windowHeight = window.screen.height;
        const scrollContainer = content.closest('.controls-Scroll-Container');
        // высота самого Controls.scroll:Container может быть фиксирована, например в SlidingPanel
        if (
            scrollContent.getBoundingClientRect().height > windowHeight &&
            scrollContainer.scrollHeight > windowHeight
        ) {
            scrollContent = document.scrollingElement;
        }
    }
    return scrollContent;
}