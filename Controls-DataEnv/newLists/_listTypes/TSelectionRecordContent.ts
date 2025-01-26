import { TKeysSelection } from './TKeySelection';

/**
 *
 */
export type TSelectionType = 'all' | 'leaf' | 'node';

/**
 * @public
 */
export type TSelectionRecordContent = {
    /**
     * @cfg {Array<Number>|Array<String>} Идентификаторы отмеченных записей.
     */
    marked: TKeysSelection;

    /**
     * @cfg {Array<Number>|Array<String>} Идентификаторы исключённых записей.
     */
    excluded: TKeysSelection;

    /**
     * @cfg {SelectionType} Тип выбираемых записей.
     */
    type: TSelectionType;
    recursive: boolean;
};
