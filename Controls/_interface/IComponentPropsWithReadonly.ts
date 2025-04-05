import { IComponentProps } from './IComponentProps';

/**
 * Расширение IComponentProps с полем readOnly
 *
 * @public
 */
export interface IComponentPropsWithReadonly extends IComponentProps {
    /**
     * Определяет режим отображения 'только для чтения'.
     */
    readOnly?: boolean;
}
