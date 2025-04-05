import { constants, detection } from 'Env/Env';

if (constants.isBrowserPlatform) {
    ((window, document) => {
        // Ветка для браузеров, поддерживающих нативно IntersectionObserver.
        if (
            !detection.isIE12 &&
            'IntersectionObserver' in window &&
            'IntersectionObserverEntry' in window &&
            'intersectionRatio' in window.IntersectionObserverEntry.prototype
        ) {
            // Minimal polyfill for Edge 15's lack of `isIntersecting`
            // See: https://github.com/w3c/IntersectionObserver/issues/211
            if (!('isIntersecting' in window.IntersectionObserverEntry.prototype)) {
                Object.defineProperty(
                    window.IntersectionObserverEntry.prototype,
                    'isIntersecting',
                    {
                        get(): boolean {
                            return this.intersectionRatio > 0;
                        },
                    }
                );
            }
            return;
        }

        // Импортируем полифил только для браузеров, не поддерживающих IntersectionObserver.
        import('Controls/polyfills');
    })(window, document);
}

export default void 0;

/* eslint-enable */
