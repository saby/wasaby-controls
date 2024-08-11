import * as React from 'react';
import HeaderTemplate from './Popup/HeaderTemplate';
import Control from './Control';
import { TKey } from 'Controls/interface';
import { IMenuControlOptions } from 'Controls/_menu/interface/IMenuControl';

export interface IMenuConfigArgs extends IMenuControlOptions {
    /**
     * Порядок меню в окне
     */
    order?: number;
    /** Заголовок шапки меню.
     * @demo Controls-demo/dropdown_new/Button/MenuHeadingCaption/Index
     * @example
     * <pre class="brush: html; highlight: [7]">
     * <!-- WML -->
     * <Controls.menu:Popup
     *    keyProperty="id"
     *    displayProperty="title"
     *    source="{{_source}}"
     *    headingCaption="{[Заголовок для меню]}" />
     * </pre>
     */
    headingCaption?: string;
}

export type TMenuConfig = Record<string, IMenuConfigArgs>;

export interface IMultipleMenu {
    menuConfigs: TMenuConfig;
    selectedKeys: Record<string, TKey[]>;
    onSelectedKeysChanged?: Function;
}

/**
 * Контрол объединенное меню.
 * @class Controls/menu:Multiple
 *
 * @public
 * @demo Controls-demo/dropdown_new/Multiple/Simple/Index
 */
export default React.forwardRef(function MultipleMenu(props: IMultipleMenu, ref): JSX.Element {
    const nodeState = React.useRef(null);

    const setRefs = React.useCallback(
        (node, name) => {
            nodeState.current = { ...nodeState?.current, [name]: node };
        },
        [nodeState]
    );

    React.useImperativeHandle(
        ref,
        () => {
            return {
                reload: (name?: string) => {
                    return getNodeByName(nodeState, name).reload();
                },
                moveItemUp: (selectedKey: TKey, name?: string) => {
                    return getNodeByName(nodeState, name).moveItemUp(selectedKey);
                },
                moveItemDown: (selectedKey: TKey, name?: string) => {
                    return getNodeByName(nodeState, name).moveItemDown(selectedKey);
                },
                closeSubMenu: (name?: string) => {
                    return getNodeByName(nodeState, name).closeSubMenu();
                },
                swipeMenuTop: (name?: string) => {
                    return getNodeByName(nodeState, name).swipeMenuTop();
                },
            };
        },
        [nodeState]
    );

    const menuNames = React.useMemo(
        () =>
            Object.keys(props.menuConfigs).sort(
                (name1, name2) =>
                    (props.menuConfigs[name1].order || 0) - (props.menuConfigs[name2].order || 0)
            ),
        [props.menuConfigs]
    );

    const onSelectedKeysChanged = React.useCallback(
        (selectedKeys, name) => {
            const newSelectedKeysMap = {
                ...props.selectedKeys,
            };
            newSelectedKeysMap[name] = selectedKeys;

            props.onSelectedKeysChanged?.(newSelectedKeysMap, name);
        },
        [props.selectedKeys, props.onSelectedKeysChanged]
    );

    const onExcludedKeysChanged = React.useCallback(
        (excludedKeys, name) => {
            const newExcludedKeysMap = {
                ...props.excludedKeys,
            };
            newExcludedKeysMap[name] = excludedKeys;

            props.onExcludedKeysChanged?.(newExcludedKeysMap);
        },
        [props.excludedKeys, props.onExcludedKeysChanged]
    );

    const dataLoadCallback = React.useCallback(
        (items, name) => {
            (props.menuConfigs[name].dataLoadCallback || props.dataLoadCallback)?.(items, name);
        },
        [props.menuConfigs, props.dataLoadCallback]
    );

    return (
        <div ref={ref} className={props.className}>
            {menuNames.map((name, index) => {
                const menuConfig = props.menuConfigs[name];
                const ItemTemplate = props.itemTemplate
                    ? (itemTemplateProps) => {
                          return <props.itemTemplate name={name} {...itemTemplateProps} />;
                      }
                    : menuConfig.itemTemplate;
                return (
                    <div key={`controls-multiple-menu-${name}`}>
                        <BeforeMenuTemplate
                            menuConfig={menuConfig}
                            index={index}
                            menuNames={menuNames}
                        />
                        <BodyContentTemplate
                            ref={(node) => setRefs(node, name)}
                            {...menuConfig}
                            selectedKeys={props.selectedKeys?.[name]}
                            excludedKeys={props.excludedKeys?.[name]}
                            itemTemplate={ItemTemplate}
                            name={name}
                            dataLoadCallback={dataLoadCallback}
                            onSelectedKeysChanged={onSelectedKeysChanged}
                            onExcludedKeysChanged={onExcludedKeysChanged}
                            onItemClick={props.onItemClick}
                            onSelectionChanged={props.onSelectionChanged}
                            onRightTemplateClick={props.onRightTemplateClick}
                            onMoreButtonClick={props.onMoreButtonClick}
                            onApplyClick={props.onApplyClick}
                            onPinClick={props.onPinClick}
                            onMenuOpened={props.onMenuOpened}
                            onBeforeSubMenuOpen={props.onBeforeSubMenuOpen}
                            onCloseButtonVisibilityChanged={props.onCloseButtonVisibilityChanged}
                            onSelectedItemsChanged={props.onSelectedItemsChanged}
                            onSubMenuMouseenter={props.onSubMenuMouseenter}
                            onExpanderClick={props.onExpanderClick}
                            onRootChanged={props.onRootChanged}
                        />
                    </div>
                );
            })}
        </div>
    );
});

const BodyContentTemplate = React.forwardRef(function (props, ref): JSX.Element {
    const onSelectedKeysChanged = React.useCallback(
        (selectedKeys) => {
            props.onSelectedKeysChanged(selectedKeys, props.name);
        },
        [props.onSelectedKeysChanged, props.name]
    );

    const onExcludedKeysChanged = React.useCallback(
        (selectedKeys) => {
            props.onExcludedKeysChanged(selectedKeys, props.name);
        },
        [props.onExcludedKeysChanged, props.name]
    );

    const dataLoadCallback = React.useCallback(
        (items) => {
            props.dataLoadCallback(items, props.name);
        },
        [props.dataLoadCallback, props.name]
    );

    const onItemClick = React.useCallback(
        (item, event) => {
            return props.onItemClick(item, event, props.name);
        },
        [props.onItemClick, props.name]
    );

    const onSelectionChanged = React.useCallback(
        (selection) => {
            props.onSelectionChanged?.(selection, props.name);
        },
        [props.onSelectionChanged, props.name]
    );

    const onRightTemplateClick = React.useCallback(
        (item, event) => {
            props.onRightTemplateClick(item, event, props.name);
        },
        [props.onRightTemplateClick, props.name]
    );

    const onMoreButtonClick = React.useCallback(
        (selectedItems) => {
            props.onMoreButtonClick(selectedItems, props.name);
        },
        [props.onMoreButtonClick, props.name]
    );

    const onPinClick = React.useCallback(
        (item) => {
            props.onPinClick(item, props.name);
        },
        [props.onPinClick, props.name]
    );

    const onCloseButtonVisibilityChanged = React.useCallback(
        (visible, position) => {
            props.onCloseButtonVisibilityChanged?.(visible, position, props.name);
        },
        [props.onCloseButtonVisibilityChanged, props.name]
    );

    const onSelectedItemsChanged = React.useCallback(
        (selectedItems) => {
            props.onSelectedItemsChanged?.(selectedItems, props.name);
        },
        [props.onSelectedItemsChanged, props.name]
    );

    const onExpanderClick = React.useCallback(
        (expander) => {
            props.onExpanderClick(expander, props.name);
        },
        [props.onExpanderClick, props.name]
    );

    const onRootChanged = React.useCallback(
        (root) => {
            props.onRootChanged(root, props.name);
        },
        [props.onRootChanged, props.name]
    );

    const onApplyClick = React.useCallback(
        (data, nativeEvent) => {
            props.onApplyClick(data, nativeEvent);
        },
        [props.onApplyClick]
    );

    return (
        <Control
            ref={ref}
            {...props}
            onSelectedKeysChanged={onSelectedKeysChanged}
            onExcludedKeysChanged={onExcludedKeysChanged}
            dataLoadCallback={dataLoadCallback}
            onItemClick={onItemClick}
            onSelectionChanged={onSelectionChanged}
            onRightTemplateClick={onRightTemplateClick}
            onMoreButtonClick={onMoreButtonClick}
            onPinClick={onPinClick}
            onMenuOpened={props.onMenuOpened}
            onBeforeSubMenuOpen={props.onBeforeSubMenuOpen}
            onCloseButtonVisibilityChanged={onCloseButtonVisibilityChanged}
            onSelectedItemsChanged={onSelectedItemsChanged}
            onSubMenuMouseenter={props.onSubMenuMouseenter}
            onExpanderClick={onExpanderClick}
            onRootChanged={onRootChanged}
            onApplyClick={onApplyClick}
        />
    );
});

const BeforeMenuTemplate = React.forwardRef(
    (
        {
            menuConfig,
            index,
            menuNames,
        }: { menuConfig: IMenuConfigArgs; index: number; menuNames: string[] },
        ref
    ) => {
        if (menuConfig.headingCaption) {
            const markedVisible =
                menuConfig.markerVisibility === 'onactivated' ||
                menuConfig.markerVisibility === 'visible';
            return (
                <HeaderTemplate
                    ref={ref}
                    caption={menuConfig.headingCaption}
                    markerVisibility={menuConfig.markerVisibility}
                    multiSelect={menuConfig.multiSelect}
                    className={`controls-MenuButton__popup-header ${
                        markedVisible
                            ? 'controls-MenuButton__popup-header-paddingLeft_s'
                            : 'controls-MenuButton__popup-header-paddingLeft_default'
                    }`}
                />
            );
        }
        return null;
    }
);

function getNodeByName(nodeState: Record<string, HTMLElement>, name?: string): HTMLElement {
    return name ? nodeState.current[name] : Object.values(nodeState.current)[0];
}
