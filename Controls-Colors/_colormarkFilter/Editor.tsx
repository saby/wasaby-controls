import rk = require('i18n!Controls-Colors');
import * as React from 'react';
import {
    IColorMarkElement,
    ICustomMarkElement,
    IMarkSelectorOptions,
    TMarkElement,
} from 'Controls-Colors/colormark';
import { BaseEditor, IEditorOptions } from 'Controls/filterPanel';
import { getStyleClasses } from 'Controls-Colors/utils/function';
import { Icon } from 'Controls/icon';
import { RecordSet } from 'Types/collection';
import { useCallback } from 'react';
import 'css!Controls-Colors/colormarkFilter';
import { object } from 'Types/util';
import { StickyOpener } from 'Controls/popup';
import { isEqual } from 'Types/object';
import 'css!Controls-Colors/colormark';

interface ISelection {
    selected: string[];
    excluded: string[];
}

interface IColorMarkFilterSelector extends IMarkSelectorOptions, IEditorOptions<ISelection> {
    fontSize?: string;
}

const DEFAULT_VALUE = {
    selected: [],
    excluded: [],
};

export default React.forwardRef(function ColorMarkSelector(props: IColorMarkFilterSelector, ref) {
    const popupRef: React.MutableRefObject<HTMLDivElement> = React.useRef();
    const beforeSelectionChanged = React.useCallback((keys: string[]) => {
        return keys;
    }, []);
    const openSelector = React.useCallback(() => {
        const stickyOpener = new StickyOpener({});
        stickyOpener.open({
            opener: popupRef.current,
            target: popupRef.current,
            templateOptions: {
                items: props.items,
                palette: props.palette,
                selectedKeys: props.propertyValue?.selected || [],
                excludedKeys: props.propertyValue?.excluded || [],
                onBeforeSelectionChanged: beforeSelectionChanged,
                excludable: true,
                multiSelect: true,
                adding: false,
            },
            template: 'Controls-Colors/dialogTemplate:ColormarkTemplate',
            width: 252,
            eventHandlers: {
                onResult(selected: string[], excluded: string[]) {
                    onSelectionChanged({
                        selected,
                        excluded,
                    });
                    stickyOpener.close();
                },
            },
        });
    }, [props.items, props.palette, props.propertyValue, popupRef]);

    const onSelectionChanged = React.useCallback(
        (newValue: ISelection) => {
            let textValue = '';
            if (!isEqual(newValue, props.resetValue)) {
                // Если кликнули в исключенную запись, excludedKey не успевает обновиться и приходит с выбранной записью, удаляем ее из excluded
                const includedKeyIndex = newValue.excluded.findIndex((excludedKey) =>
                    newValue.selected.includes(excludedKey)
                );
                if (includedKeyIndex !== -1) {
                    newValue.excluded.splice(includedKeyIndex, 1);
                }
                if (newValue.selected.length) {
                    textValue += `${rk('Пометки')}: `;
                    textValue += getTextValue(newValue.selected, props.items);
                }
                if (newValue.excluded.length) {
                    if (textValue) {
                        textValue += ', ';
                    }
                    textValue += `${rk('Исключить')}: `;
                    textValue += getTextValue(newValue.excluded, props.items);
                }
            }
            props.onPropertyValueChanged?.({
                value: newValue,
                textValue,
                viewMode: isEqual(newValue, props.resetValue) ? 'extended' : 'basic',
            });
        },
        [props.items, props.onPropertyValueChanged]
    );
    const onExtendedCaptionClick = React.useCallback(() => {
        openSelector();
    }, [openSelector]);

    const editorTemplateProps = React.useMemo(() => {
        return {
            items: props.items,
            propertyValue: props.propertyValue || DEFAULT_VALUE,
            resetValue: props.resetValue,
            fontSize: props.fontSize,
            onSelectionChanged,
            openSelector,
        };
    }, [props.items, props.propertyValue, props.fontSize, openSelector]);

    const setRef = (element) => {
        if (ref) {
            ref(element);
        }
        popupRef.current = element;
    };

    return (
        <BaseEditor
            ref={setRef}
            attrs={props.attrs}
            propertyValue={props.propertyValue}
            resetValue={props.resetValue}
            viewMode={props.viewMode}
            extendedCaption={props.extendedCaption}
            onPropertyValueChanged={props.onPropertyValueChanged}
            onExtendedCaptionClick={onExtendedCaptionClick}
            closeButtonVisible={false}
            editorTemplate={EditorTemplate}
            editorTemplateOptions={editorTemplateProps}
        />
    );
});

function EditorTemplate(props: IColorMarkFilterSelector) {
    const { selected, excluded } = props.propertyValue;
    const removeFrom = React.useCallback(
        (from: string, key: string) => {
            const newValue = object.clone(props.propertyValue);
            const index = newValue[from].indexOf(key);
            newValue[from].splice(index, 1);
            props.onSelectionChanged(newValue);
        },
        [props.propertyValue, props.onSelectionChanged]
    );
    const removeFromSelected = React.useCallback(
        (key: string) => {
            removeFrom('selected', key);
        },
        [removeFrom]
    );
    const removeFromExcluded = React.useCallback(
        (key: string) => {
            removeFrom('excluded', key);
        },
        [removeFrom]
    );
    const resetFilter = React.useCallback(() => {
        props.onSelectionChanged(props.resetValue);
    }, [props.resetValue]);
    return (
        <div className="ColormarkFilter__Editor">
            <div className="tw-cursor-pointer ws-flexbox ws-align-items-baseline">
                <div
                    className={`controls-FilterViewPanel__basicEditor-cloud controls-fontsize-${props.fontSize}`}
                    onClick={props.openSelector}
                >
                    {rk('Пометки')}
                </div>
                <ResetIcon onClick={resetFilter} />
            </div>
            <div className="ColormarkFilter__Editor-itemsView">
                {selected.length ? (
                    <For
                        keys={selected}
                        items={props.items}
                        selectionChanged={removeFromSelected}
                    />
                ) : null}
                {excluded.length ? (
                    <div className="ws-flexbox ws-flex-wrap">
                        <div className="controls-text-label ws-inline-flexbox ws-align-items-center">
                            {rk('Исключить')}:
                        </div>
                        <For
                            keys={excluded}
                            items={props.items}
                            selectionChanged={removeFromExcluded}
                        />
                    </div>
                ) : null}
            </div>
        </div>
    );
}

function For(props: {
    keys: string[];
    items: (IColorMarkElement | ICustomMarkElement)[];
    selectionChanged: Function;
}) {
    const itemTemplates = React.useMemo(() => {
        return props.keys.map((key, index) => {
            const selectionChanged = () => {
                props.selectionChanged(key);
            };
            return (
                <ItemTemplate
                    key={key}
                    item={findItem(props.items, key)}
                    selectionChanged={selectionChanged}
                    className={`${index ? 'controls-padding_left-3xs' : ''}`}
                />
            );
        });
    }, [props.items, props.keys]);
    return <div className="ws-flexbox ws-flex-wrap">{itemTemplates}</div>;
}

function ItemTemplate(props: { item?: TMarkElement; selectionChanged: Function }) {
    const item = props.item;
    const caption = item?.caption;
    const getStyle = useCallback(() => {
        return {
            backgroundColor:
                item.value.color.indexOf('--') !== -1
                    ? 'var(' + item.value.color + ')'
                    : item.value.color,
        };
    }, [item]);
    return (
        <div
            className={`${props.className} ws-inline-flexbox ws-align-items-center`}
            title={caption}
        >
            {item.icon ? (
                <div
                    className={`controls-icon controls-icon_size-m controls-icon_style-${
                        item?.iconStyle || 'secondary'
                    } icon-${item.icon}`}
                ></div>
            ) : (
                <div
                    className="ColormarkFilter__Editor__iconWidth
                     controls-inlineheight-m ws-flexbox ws-align-items-center ws-justify-content-center"
                >
                    <div className="ColormarkFilter__Editor__icon" style={getStyle()}></div>
                </div>
            )}

            <div className="ws-flexbox ws-align-items-baseline">
                <div className={item?.type === 'style' ? getStyleClasses(item?.value?.style) : ''}>
                    {caption}
                </div>
                <ResetIcon
                    onClick={props.selectionChanged}
                    dataQa="ColormarkFilter__Editor__itemTemplate-cross"
                />
            </div>
        </div>
    );
}

function ResetIcon(props: { onClick: Function }) {
    return (
        <Icon
            iconStyle="unaccented"
            icon="icon-CloseNew"
            className="ColormarkFilter__Editor__resetIcon"
            onClick={props.onClick}
            dataQa={props.dataQa}
        />
    );
}

function findItem(items: TMarkElement[], key: string): TMarkElement | void {
    return items.find((item) => item.id === key);
}

function getTextValue(keys: string[], items: RecordSet): string {
    return keys.map((key) => findItem(items, key).caption).join(', ');
}