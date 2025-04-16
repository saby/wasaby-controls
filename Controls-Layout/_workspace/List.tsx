/**
 * @kaizen_zone da8d7d1f-1cf8-4615-9f04-1fc7d15d1d51
 */
import { forwardRef } from 'react';
import { useTheme } from 'UI/Contexts';
import { StickyBlock } from 'Controls/stickyBlock';
import { lazy, importer } from 'UI/Async';
import { useAdaptiveMode } from 'UI/Adaptive';
import { IOperationsPanelWidgetOptions } from 'Controls-ListEnv/operationsPanelConnected';
import { ISearchInputOptions } from 'Controls-ListEnv/searchConnected';

const LazyMisspell = lazy(() => importer('Controls-ListEnv/searchConnected:Misspell'));
const LazyOpenerationsPanel = lazy(() =>
    importer('Controls-ListEnv/operationsPanelConnected:View')
);

/**
 * @public
 */
interface IStickyProps {
    /**
     * @name Controls-Layout/_workspace/List:IStickyProps#backgroundStyle
     * @cfg {string} Фон прилипающего блока. Определяет постфикс стиля для настройки фона контрола
     */
    backgroundStyle: string;
    /**
     * @name Controls-Layout/_workspace/List:IStickyProps#pixelRatioBugFix
     * @cfg {boolean} Опция, которая решает проблему возникновения разрыва над прилипающем заголовком на масштабах и safari.
     * @default true
     */
    pixelRatioBugFix: boolean;
    /**
     * @name Controls-Layout/_workspace/List:IStickyProps#subPixelArtifactFix
     * @cfg {boolean} Опция позволяет включить/отключить фикс, решающий проблему с разрывами между заголовками.
     * @default false
     */
    subPixelArtifactFix: boolean;
}

/**
 * @public
 */
export interface IWorkspaceList {
    /**
     * @name Controls-Layout/_workspace/List:IWorkspaceList#stickyHeader
     * @cfg {boolean} Прилипание шапки раскладки при прокрутке страницы.
     * @default false
     */
    stickyHeader: boolean;
    /**
     * @name Controls-Layout/_workspace/List:IWorkspaceList#stickyProps
     * @cfg {IStickyProps} Настройки прилипающего блока.
     */
    stickyProps: IStickyProps;
    /**
     * @name Controls-Layout/_workspace/List:IWorkspaceList#searchConfig
     * @cfg {ISearchInputOptions} Настройки {@link Controls-ListEnv/searchConnected:Input строки поиска}.
     * @remark
     *  Наличие <b>storeId</b> в настройках влияет на отображение {@link Controls-ListEnv/searchConnected:Misspell подсказки},
     *  если поиск был произведён в неправильной раскладке. Остальные параметры будут проигнорированы.
     * @default null
     */
    searchConfig?: Partial<ISearchInputOptions>;
    /**
     * @name Controls-Layout/_workspace/List:IWorkspaceList#operationsPanelConfig
     * @cfg {IOperationsPanelWidgetOptions} Настройки {@link Controls-ListEnv/operationsPanelConnected:View панели массовых операций} над списком.
     * @default null
     */
    operationsPanelConfig?: Partial<IOperationsPanelWidgetOptions>;
}

/**
 * Контрол, представляющий раскладку ПМО, пользовательского списка и подсказки, если поиск был произведён в неправильной раскладке.
 * @class Controls-Layout/workspace:List
 * @interface Controls-Layout/workspace:IWorkspaceList
 * @public
 * @author Клепиков И.А.
 * @example
 * Пример настройки раскладки в шаблоне.
 * TSX:
 * <pre class="brush: js">
 * import { forwardRef } from 'react';
 * import { View as ListView } from 'Controls/list';
 * import { Container as ScrollContainer } from 'Controls/scroll';
 * import { List as Template, IWorkspaceList } from 'Controls-Layout/workspace';
 *
 * const STICKY_CONFIG: IWorkspaceList['stickyProps'] = {
 *     backgroundStyle: 'default',
 *     subPixelArtifactFix: true,
 *     pixelRatioBugFix: true,
 * };
 *
 * const WorkspaceList = forwardRef((props, ref) => {
 *     return (
 *         // Контейнер скролла списка
 *         <ScrollContainer className={props.className || ''}>
 *             <Template
 *                 ref={ref}
 *                 stickyHeader={true}
 *                 stickyProps={STICKY_CONFIG}
 *                 operationsPanelConfig={{ storeId: 'MyStoreId' }}
 *                 searchConfig={{ storeId: 'MyStoreId' }}
 *             >
 *                 <div>
 *                     <ListView storeId={'MyStoreId'}></ListView>
 *                 </div>
 *             </Template>
 *         </ScrollContainer>
 *     );
 * });
 * </pre>
 * @demo Controls-Layout-demo/Workspace/List/Index
 * @see Controls-ListEnv/operationsPanelConnected:View
 * @see Controls-ListEnv/searchConnected:Input
 * @see Controls-ListEnv/searchConnected:Misspell
 */

const List = forwardRef((props: IWorkspaceList, ref) => {
    const themeFromContext = useTheme();
    const isAdaptive = useAdaptiveMode().device.isPhone();
    return (
        <div
            ref={ref}
            className={'controls-Layout-Workspace controls_Layout_theme-' + themeFromContext}
        >
            {props.operationsPanelConfig ? (
                // Плитка (TileView__item) при ховере увеличивается в размерах и получает z-index: 2
                // При таком значении плитка перекрывает стикиБлок, поэтому нужно задать стикиБлоку z-index на 1 больше
                props.stickyHeader && !isAdaptive ? (
                    <StickyBlock
                        shadowVisibility="lastVisible"
                        fixedZIndex={3}
                        mode="stackable"
                        backgroundStyle={props.stickyProps?.backgroundStyle}
                        pixelRatioBugFix={props.stickyProps?.pixelRatioBugFix}
                        subPixelArtifactFix={props.stickyProps?.subPixelArtifactFix}
                    >
                        <div className="controls-Layout-Workspace__operationsPanel">
                            <LazyOpenerationsPanel
                                {...props.operationsPanelConfig}
                            ></LazyOpenerationsPanel>
                        </div>
                    </StickyBlock>
                ) : (
                    <div className="controls-Layout-Workspace__operationsPanel">
                        <LazyOpenerationsPanel
                            {...props.operationsPanelConfig}
                        ></LazyOpenerationsPanel>
                    </div>
                )
            ) : null}
            {props.searchConfig?.storeId ? (
                <LazyMisspell
                    className="controls-Layout-Workspace__misspell"
                    storeId={props.searchConfig?.storeId}
                />
            ) : null}
            <div className="controls-Layout-Workspace__content">
                {props.children ? props.children : null}
            </div>
        </div>
    );
});

List.displayName = 'Controls-Layout/workspace:List';

export default List;

/**
 * @name Controls-Layout/_workspace/List#stickyHeader
 * @cfg {boolean} Прилипание шапки раскладки при прокрутке страницы.
 * @default false
 */
/**
 * @name Controls-Layout/_workspace/List#stickyProps
 * @cfg {IStickyProps} Настройки прилипающего блока.
 */
/**
 * @name Controls-Layout/_workspace/List#searchConfig
 * @cfg {Controls-ListEnv/searchConnected:ISearchInputOptions} Настройки {@link Controls-ListEnv/searchConnected:Input строки поиска}.
 * @remark
 *  Наличие <b>storeId</b> в настройках влияет на отображение {@link Controls-ListEnv/searchConnected:Misspell подсказки},
 *  если поиск был произведён в неправильной раскладке. Остальные параметры будут проигнорированы.
 * @default null
 */
/**
 * @name Controls-Layout/_workspace/List#operationsPanelConfig
 * @cfg {Controls-ListEnv/operationsPanelConnected:IOperationsPanelWidgetOptions} Настройки {@link Controls-ListEnv/operationsPanelConnected:View панели массовых операций} над списком.
 * @default null
 */

/**
 * @typedef {Object} IStickyProps
 * @property {string} backgroundStyle Фон прилипающего блока. Определяет постфикс стиля для настройки фона контрола
 * @property {boolean} pixelRatioBugFix Опция, которая решает проблему возникновения разрыва над прилипающем заголовком на масштабах и safari.
 * @property {boolean} subPixelArtifactFix Опция позволяет включить/отключить фикс, решающий проблему с разрывами между заголовками.
 */
