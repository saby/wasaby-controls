/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import { IAbstractRenderEventHandlers } from 'Controls-Lists/abstractList';

export interface ITileRenderEventHandlers extends IAbstractRenderEventHandlers {
    onItemClick: (item, e) => void;
}
