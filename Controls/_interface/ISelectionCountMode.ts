/**
 * @kaizen_zone 916d4071-6bb4-4800-b3ff-2ee6725c9fdc
 */
/**
 * @typedef {String} Controls/_interface/ISelectionCountModeOptions/TSelectionCountMode
 * @variant all Подсчитываются все виды записей.
 * @variant node Подсчитываются только узлы.
 * @variant leaf Подсчитываются только листья.
 */
export type TSelectionCountMode = 'all' | 'leaf' | 'node';

/**
 * Интерфейс для контролов, поддерживающих подсчет записей определённого типа.
 *
 * @public
 */
export interface ISelectionCountModeOptions {
    readonly '[Controls/_interface/ISelectionCountMode]': boolean;
    selectionCountMode?: TSelectionCountMode;
}

/**
 * @name Controls/_interface/ISelectionCountModeOptions#selectionCountMode
 * @cfg {Controls/_interface/ISelectionCountModeOptions/TSelectionCountMode.typedef} Тип подсчитываемых записей.
 * @default all
 * @demo Controls-demo/treeGridNew/MultiSelect/SelectionCountMode/Index
 * @example
 * В этом примере для подсчета будут доступны только листья.
 * <pre class="brush: html">
 * <!-- WML -->
 * <Layout.Selector.Browser parentProperty="Раздел" nodeProperty="Раздел@" selectionCountMode="leaf">
 *     <ws:content>
 *         <Controls.treeGrid:View />
 *     </ws:content>
 * </Layout.Selector.Browser>
 * </pre>
 */
