/**
 * @kaizen_zone 7b560386-8131-481a-b9c0-8b3ede6f29a0
 */
import { Control, TemplateFunction } from 'UI/Base';
import { IEdgeIntersectionObserverOptions } from './Types';
import EdgeIntersectionObserver from './EdgeIntersectionObserver';
import template = require('wml!Controls/_scroll/IntersectionObserver/EdgeIntersectionContainer');
import 'css!Controls/scroll';

/**
 * Контейнер, позволяющий отслеживать пересечение своих границ с границами скроллируемой области.
 *
 * @class Controls/_scroll/IntersectionObserver/EdgeIntersectionContainer
 *
 * @see Controls/_scroll/Container
 * @public
 */

class EdgeIntersectionObserverContainer extends Control<IEdgeIntersectionObserverOptions> {
    protected _template: TemplateFunction = template;
    protected _observer: EdgeIntersectionObserver;

    protected _afterMount(): void {
        this._observer = new EdgeIntersectionObserver(
            this,
            this._observeHandler.bind(this),
            this._children.topTrigger,
            this._children.bottomTrigger
        );
    }

    protected _observeHandler(eventName: string): void {
        this._notify(eventName);
    }

    protected _beforeUnmount(): void {
        this._observer.destroy();
        this._observer = null;
    }
}

export default EdgeIntersectionObserverContainer;
/**
 * @name Controls/_scroll/IntersectionObserver/EdgeIntersectionContainer#topOffset
 * @cfg {number} Смещение относительно верхней границы контенера. Можно отслеживать моменты когда до границы контейнера
 * еще осталось какое то расстояние.
 * @demo Controls-demo/Scroll/EdgeIntersectionContainer/Default/Index
 */

/**
 * @name Controls/_scroll/IntersectionObserver/EdgeIntersectionContainer#bottomOffset
 * @cfg {number} Смещение относительно нижней границы контенера. Можно отслеживать моменты когда до границы контейнера
 * еще осталось какое то расстояние.
 * @demo Controls-demo/Scroll/EdgeIntersectionContainer/Default/Index
 */

/**
 * @event topIn Происходит, когда верхняя граница контейнера становится видимой.
 * @name Controls/_scroll/IntersectionObserver/EdgeIntersectionContainer#topIn
 * @demo Controls-demo/Scroll/EdgeIntersectionContainer/Default/Index
 */

/**
 * @event topOut Происходит, когда верхняя граница контейнера становится невидимой.
 * @name Controls/_scroll/IntersectionObserver/EdgeIntersectionContainer#topOut
 * @demo Controls-demo/Scroll/EdgeIntersectionContainer/Default/Index
 */

/**
 * @event bottomIn Происходит, когда нижняя граница контейнера становится видимой.
 * @name Controls/_scroll/IntersectionObserver/EdgeIntersectionContainer#bottomIn
 * @demo Controls-demo/Scroll/EdgeIntersectionContainer/Default/Index
 */

/**
 * @event bottomOut Происходит, когда нижняя граница контейнера становится невидимой.
 * @name Controls/_scroll/IntersectionObserver/EdgeIntersectionContainer#bottomOut
 * @demo Controls-demo/Scroll/EdgeIntersectionContainer/Default/Index
 */
