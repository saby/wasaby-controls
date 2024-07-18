import * as React from 'react';
import MultipleMenu from './Multiple';
import { TKey, TSelectedKeys } from 'Controls/interface';
import { factory } from 'Types/chain';
import { IMenuConfigArgs } from 'Controls/_menu/Multiple';
import { delimitProps } from 'UICore/Jsx';

interface IMenuControl extends IMenuConfigArgs {
    menuConfigs: Record<string, IMenuConfigArgs>;
}

const MENU_DEFAULT_KEY = 'menu';

export default React.forwardRef(function MenuConfigResolver(props: IMenuControl, ref): JSX.Element {
    const menuRef = React.useRef(null);
    const { clearProps } = delimitProps(props);
    const { selectedKeysState, excludedKeysState } = React.useMemo(() => {
        return {
            selectedKeysState: props.menuConfigs
                ? props.selectedKeys || {}
                : { [MENU_DEFAULT_KEY]: props.selectedKeys },
            excludedKeysState: props.menuConfigs
                ? props.excludedKeys || {}
                : { [MENU_DEFAULT_KEY]: props.excludedKeys },
        };
    }, []);

    const menuConfigs = props.menuConfigs || {
        [MENU_DEFAULT_KEY]: clearProps,
    };

    const [selectedKeys, setSelectedKeys] = React.useState(selectedKeysState);
    const [excludedKeys, setExcludedKeys] = React.useState(excludedKeysState);

    const selection = React.useRef({
        selected: selectedKeysState,
        excluded: excludedKeysState,
    });

    const onSelectedKeysChanged = React.useCallback(
        (selectedKeysMap) => {
            const newKeys = props.menuConfigs ? selectedKeysMap : selectedKeysMap[MENU_DEFAULT_KEY];
            props.onSelectedKeysChanged(newKeys);
            if (props.multiSelect) {
                setSelectedKeys(selectedKeysMap);
                selection.current.selected = selectedKeysMap;
                updateApplyButton(selectedKeysMap, selection.current.excluded);
            }
        },
        [props.multiSelect, props.onSelectedKeysChanged, selectedKeys]
    );

    const onExcludedKeysChanged = React.useCallback(
        (excludedKeysMap) => {
            const newKeys = props.menuConfigs ? excludedKeysMap : excludedKeysMap[MENU_DEFAULT_KEY];
            props.onExcludedKeysChanged(newKeys);
            if (props.multiSelect) {
                setExcludedKeys(excludedKeysMap);
                selection.current.excluded = excludedKeysMap;
                updateApplyButton(selection.current.selected, excludedKeysMap);
            }
        },
        [props.multiSelect, props.onSelectedKeysChanged, excludedKeys]
    );

    const updateApplyButton = React.useCallback((newSelectedKeys = [], newExcludedKeys = []) => {
        if (props.applyButtonVisibility !== 'hidden' && props.multiSelect) {
            const applyButtonVisible =
                isKeysChanged(newSelectedKeys, selectedKeysState, menuConfigs) ||
                isKeysChanged(newExcludedKeys, excludedKeysState, menuConfigs);
            props.onApplyButtonVisibleChanged?.(applyButtonVisible);
        }
    }, []);

    React.useImperativeHandle(
        ref,
        () => {
            return {
                reload: (name?: string) => menuRef.current.reload(name),
                moveItemUp: (selectedKey: TKey, name?: string) =>
                    menuRef.current.moveItemUp(selectedKey, name),
                moveItemDown: (selectedKey: TKey, name?: string) =>
                    menuRef.current.moveItemDown(selectedKey, name),
                closeSubMenu: (name?: string) => menuRef.current.closeSubMenu(name),
                swipeMenuTop: (name?: string) => menuRef.current.swipeMenuTop(name),
            };
        },
        [menuRef.current]
    );

    const setRef = React.useCallback((node) => {
        if (!node) {
            return;
        }
        menuRef.current = node;
        if (ref) {
            ref(node);
        }
    }, []);

    return (
        <MultipleMenu
            ref={setRef}
            className={props.className}
            menuConfigs={menuConfigs}
            selectedKeys={selectedKeys}
            excludedKeys={excludedKeys}
            onSelectedKeysChanged={onSelectedKeysChanged}
            onExcludedKeysChanged={onExcludedKeysChanged}
            // Событие переименовано для того, чтобы можно было вернуть из него результат, из-за особенности системы событий. После перевода на реакт вернуть itemClick
            onItemClick={props.onMenuItemClick}
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
        />
    );
});

function isKeysChanged(
    newKeysMap: Record<string, TSelectedKeys>,
    oldKeysMap: Record<string, TSelectedKeys>,
    menuConfigs: Record<string, IMenuConfigArgs>
): boolean {
    const menuNames = Object.keys(menuConfigs);

    const isChanged = (newKeys: TSelectedKeys, oldKeys: TSelectedKeys) => {
        const diffKeys: TSelectedKeys = factory(newKeys)
            .filter((key) => {
                return !oldKeys.includes(key);
            })
            .value();
        return newKeys.length !== oldKeys.length || !!diffKeys.length;
    };

    // В каждом меню должно быть выбрано значение
    const everyMenuIsSelected =
        menuNames.length < 2 ||
        menuNames.every(
            (name) =>
                newKeysMap[name]?.length ||
                menuConfigs[name].emptyText ||
                menuConfigs[name].selectedAllText
        );

    if (everyMenuIsSelected) {
        return menuNames.some((name) => {
            return isChanged(newKeysMap[name] || [], oldKeysMap[name] || []);
        });
    }
    return false;
}
