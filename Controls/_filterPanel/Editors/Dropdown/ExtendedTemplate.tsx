import * as React from 'react';
import { loadAsync } from 'WasabyLoader/ModulesLoader';
import FrequentItem from 'Controls/_filterPanel/Editors/resources/FrequentItem';
import { constants } from 'Env/Env';
import { Model } from 'Types/entity';
import { TKey } from 'Controls/interface';
import { List } from 'Types/collection';
import { factory } from 'Types/chain';
import { _Controller } from 'Controls/dropdown';
import { isEqual } from 'Types/object';
import { SyntheticEvent } from 'Vdom/Vdom';

function prepareResultFromMenu(
    result: Model[],
    { keyProperty, displayProperty }
): {
    value: TKey[];
    textValue: string;
} {
    const selectedKeys = [];
    const text = [];

    result.forEach((item) => {
        selectedKeys.push(item.get(keyProperty));
        text.push(item.get(displayProperty));
    });

    return {
        value: selectedKeys,
        textValue: text.join(', '),
    };
}

function onSelectedKeysChanged(
    props,
    value: TKey[] | TKey,
    text: string,
    viewMode: string = 'basic'
): void {
    if (!isEqual(value, props.propertyValue)) {
        const extendedValue = {
            value,
            textValue: text,
            viewMode,
        };
        props.onPropertyValueChanged?.(
            new SyntheticEvent(null, {
                type: 'propertyValueChanged',
            }),
            extendedValue
        );
    }
}

function handleMenuItemsActivate(data: Model[], props) {
    const result = prepareResultFromMenu(data, props);
    onSelectedKeysChanged(
        props,
        props.multiSelect ? result.value : result.value[0],
        result.textValue
    );
}

function getDropdownController(props, targetRef): Promise<_Controller> {
    return loadAsync('Controls/dropdown').then(({ _Controller }) => {
        const selectedKeys =
            props.propertyValue instanceof Array ? props.propertyValue : [props.propertyValue];

        const controller = new _Controller({
            ...props,
            closeMenuOnOutsideClick: true,
            openerControl: targetRef.current,
            target: targetRef.current,
            popupClassName: `controls_filterPanel_theme-${props.theme} controls-FilterViewPanel__dropdownEditor_popupClassName`,
            markerVisibility: props.multiSelect ? 'hidden' : 'onactivated',
            headingCaption: props.menuHeadingCaption,
            selectorDialogResult: (items: List<Model>) => {
                handleMenuItemsActivate(factory(items).toArray(), props);
                controller.handleSelectorResult(items);
            },
            selectedKeys,
        });
        return controller;
    });
}

function openMenu(ddlController: _Controller, props): void {
    const eventHandlers = {
        onResult: (action, data) => {
            switch (action) {
                case 'itemClick':
                    const item = ddlController.getPreparedItem(data);
                    handleMenuItemsActivate([item], props);
                    ddlController.updateHistoryAndCloseMenu(item);
                    break;
                case 'applyClick':
                    handleMenuItemsActivate(data.items, props);
                    ddlController.updateHistoryAndCloseMenu(data.items);
                    break;
                case 'openSelectorDialog':
                    ddlController.openSelectorDialog(data);
            }
        },
    };

    ddlController.openMenu({ eventHandlers }).then((items) => {
        if (items) {
            handleMenuItemsActivate(items, props);
        }
    });
}

export default React.memo(
    React.forwardRef((props, ref) => {
        const targetRef = React.useRef();
        const [controller, setController] = React.useState<_Controller>();

        const setRefs = React.useCallback((element) => {
            targetRef.current = element;
            if (ref) {
                ref(element);
            }
        }, []);

        const { onHandleKeyDown, onDeactivated } = React.useMemo(() => {
            return {
                onHandleKeyDown: (event: Event) => {
                    if (event.nativeEvent.keyCode === constants.key.esc) {
                        controller?.closeMenu();
                    }
                },
                onDeactivated: () => {
                    controller?.closeMenu();
                },
            };
        }, [controller]);

        const onExtendedCaptionClick = React.useCallback(() => {
            getDropdownController(props, targetRef).then((ddlController) => {
                setController(ddlController);
                openMenu(ddlController, props);
            });
        }, [props.filter]);

        return (
            <FrequentItem
                ref={setRefs}
                attrs={props.attrs}
                extendedCaption={props.extendedCaption}
                frequentItemText={props.frequentItemText}
                frequentItemKey={props.frequentItemKey}
                displayProperty={props.displayProperty}
                keyProperty={props.keyProperty}
                multiSelect={props.multiSelect}
                items={props.items}
                name={props.name}
                onExtendedCaptionClick={onExtendedCaptionClick}
                onPropertyValueChanged={props.onPropertyValueChanged}
                onDeactivated={onDeactivated}
                onKeyDown={onHandleKeyDown}
                fastDataQa="controls-FilterViewPanel__DropdownEditor-fastItem"
            />
        );
    })
);
