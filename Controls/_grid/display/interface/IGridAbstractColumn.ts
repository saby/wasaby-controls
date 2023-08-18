/**
 * @kaizen_zone 125406bf-1a36-46c5-a630-82966fed8357
 */
import { TemplateFunction } from 'UI/Base';

export interface IGridAbstractColumn {
    template?: TemplateFunction;
    startColumn?: number;
    endColumn?: number;
}
