/**
 * @kaizen_zone 7b560386-8131-481a-b9c0-8b3ede6f29a0
 */
import { IControlOptions } from 'UI/Base';

export interface IIntersectionObserverObject {
    instId: string;
    observerName: string;
    element: HTMLElement;
    threshold: number[];
    rootMargin: string;
    data: any;
    handler: Function;
}

export interface IIntersectionObserverOptions {
    observerName: string;
    threshold: number[];
    rootMargin: string;
}

export interface IEdgeIntersectionObserverOptions extends IControlOptions {
    topOffset: number;
    bottomOffset: number;
}
