/**
 * @kaizen_zone 7b560386-8131-481a-b9c0-8b3ede6f29a0
 */
import IIntersectionObserverSyntheticEntry from 'Controls/_scroll/IntersectionObserver/IIntersectionObserverSyntheticEntry';

export default class IntersectionObserverSyntheticEntry
    implements IIntersectionObserverSyntheticEntry
{
    nativeEntry: IntersectionObserverEntry;
    data: object;

    constructor(nativeEntry: IntersectionObserverEntry, data?: object) {
        this.nativeEntry = nativeEntry;
        this.data = data;
    }
}
