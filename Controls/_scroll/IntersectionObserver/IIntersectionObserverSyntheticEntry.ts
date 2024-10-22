/**
 * @kaizen_zone 7b560386-8131-481a-b9c0-8b3ede6f29a0
 */
/**
 * Интерфейс, описывающий данные, которые приходят при событии
 * {@link Controls/_scroll/IntersectionObserverController#intersect intersect}.
 *
 * @interface Controls/_scroll/interface/IIntersectionObserverSyntheticEntry
 * @public
 */
export default interface IIntersectionObserverSyntheticEntry {
    /**
     * {@link Controls/_scroll/IntersectionObserverContainer#data Данные}, заданные на {@link Controls/_scroll/IntersectionObserverContainer IntersectionObserverContainer}.
     * @name Controls/_scroll/interface/IIntersectionObserverSyntheticEntry#data
     * @cfg {Object}
     * @default undefined
     */
    data: object;

    /**
     * @name Controls/_scroll/interface/IIntersectionObserverSyntheticEntry#nativeIntersectionObserverEntry
     * @cfg {IntersectionObserverEntry} Объект, реализующий
     * {@link https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserverEntry интерфейс IntersectionObserverEntry}.
     */
    nativeEntry: IntersectionObserverEntry;
}
