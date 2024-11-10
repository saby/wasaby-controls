/**
 * @kaizen_zone 36a75113-dfe7-4e08-9a93-ea06b26981f4
 */
import { TemplateFunction } from 'UI/Base';

export interface IGridAbstractColumn {
    template?: TemplateFunction;
    startColumn?: number;
    endColumn?: number;
}
