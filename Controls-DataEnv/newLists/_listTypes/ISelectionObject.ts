import { TKeysSelection } from './TKeySelection';

/**
 * @public
 */
export interface ISelectionObject {
    /**
     * @cfg {Array<Number>|Array<String>} Идентификаторы отмеченных записей.
     */
    selected: TKeysSelection;
    /**
     * @cfg {Array<Number>|Array<String>} Идентификаторы исключённых записей.
     */
    excluded: TKeysSelection;
    recursive?: boolean;
}
