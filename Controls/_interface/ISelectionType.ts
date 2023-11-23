/**
 * @kaizen_zone 916d4071-6bb4-4800-b3ff-2ee6725c9fdc
 */
export type TSelectionType = 'all' | 'leaf' | 'node';
export { Model } from 'Types/entity';

export type TKeySelection = number | string | null;
export type TKeysSelection = TKeySelection[];

export type TSelectionRecord = Model<{
    marked: TKeysSelection;
    excluded: TKeysSelection;
    type: TSelectionType;
    recursive: boolean;
}>;

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

export interface ISelectionTypeOptions {
    selectionType?: TSelectionType;
    recursiveSelection?: boolean;
}

/**
 * Интерфейс для контролов, поддерживающих выбор записей определённого типа.
 *
 * @public
 */

export default interface ISelectionType {
    readonly '[Controls/_interface/ISelectionType]': boolean;
}

/**
 * @typedef {String} SelectionType
 * @variant all Для выбора доступны любые типы элементов.
 * @variant allBySelectAction Для выбора доступен любой тип элемента. Выбор осуществляется нажатием кнопки «Выбрать».
 * @variant node Для выбора доступны только элементы типа «узел» и «скрытый узел».
 * @variant leaf Для выбора доступны только элементы типа «лист».
 */

/**
 * @name Controls/_interface/ISelectionType#selectionType
 * @cfg {SelectionType} Тип выбираемых записей.
 * @default all
 * @example
 * В этом примере для выбора будут доступны только узлы.
 * <pre class="brush: html">
 * <!-- WML -->
 * <Layout.Selector.Browser parentProperty="Раздел" nodeProperty="Раздел@" selectionType="node">
 *     <ws:content>
 *         <Controls.treeGrid:View />
 *     </ws:content>
 * </Layout.Selector.Browser>
 * </pre>
 */

/**
 * @name Controls/_interface/ISelectionType#recursiveSelection
 * @cfg {Boolean} Определяет, будут ли выбираться дочерние элементы при выборе папки.
 * @default true
 * @example
 * В этом примере при выборе папки в результат выбора вернётся только сама папке, без вложений.
 * <pre class="brush: html">
 * <!-- WML -->
 * <Layout.Selector.Browser parentProperty="Раздел" nodeProperty="Раздел@" selectionType="node" recursiveSelection="{{false}}">
 *     <ws:content>
 *         <Controls.treeGrid:View />
 *     </ws:content>
 * </Layout.Selector.Browser>
 * </pre>
 */

/**
 * @name Controls/_interface/ISelectionType#onlyLeaf
 * @cfg {Boolean} Задает выбор только листьев.
 * @default false
 * @example
 * В этом примере возможно выбрать только листья, выбор узлов и скрытых узлов не возможен.
 * <pre class="brush: html">
 * <!-- WML -->
 * <Layout.Selector.Browser parentProperty="Раздел" nodeProperty="Раздел@" selectionType="leaf" onlyLeaf="{{true}}">
 *     <ws:content>
 *         <Controls.treeGrid:View />
 *     </ws:content>
 * </Layout.Selector.Browser>
 * </pre>
 */
