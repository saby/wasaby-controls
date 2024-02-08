/**
 * @kaizen_zone 620ede61-d6a1-43c3-b811-f368d16d19f5
 */
import * as React from 'react';
import { IFrequentItem } from './IFrequentItem';
import { TKey } from 'Controls/interface';
import { SyntheticEvent } from 'UICommon/Events';
import { FocusRoot } from 'UI/Focus';
import { RecordSet } from 'Types/collection';
import { Logger } from 'UI/Utils';
import 'css!Controls/filterPanelEditors';

interface IFrequentItemProps extends IFrequentItem {
    onExtendedCaptionClick?: Function;
    onPropertyValueChanged?: Function;
    beforeContentTemplate?: React.ReactElement;
    beforeContentTemplateOptions?: object;
    extendedCaption?: string;
    fastDataQa?: string;
    displayProperty?: string;
    keyProperty?: string;
    items?: RecordSet;
}

interface IContentTemplate extends IFrequentItemProps {
    allItemsIsFrequent?: boolean;
}

interface IItemProps {
    separatorVisible?: boolean;
    text: string;
    id: string;
}

const BeforeContentTemplate = React.forwardRef((props: IContentTemplate, ref) => {
    if (!props.allItemsIsFrequent) {
        if (props.beforeContentTemplate) {
            return <props.beforeContentTemplate {...props.beforeContentTemplateOptions} />;
        } else {
            return (
                <div
                    tabIndex={0}
                    onKeyDown={props.onKeyDown}
                    className={
                        'tw-cursor-pointer ' +
                        (props.frequentItemKey || props.frequentItems
                            ? 'ws-flex-shrink-0 controls-FilterViewPanel__editor_underline'
                            : 'ws-ellipsis')
                    }
                    onClick={() => {
                        props.onExtendedCaptionClick?.();
                    }}
                    title={props.extendedCaption}
                    data-qa="FilterViewPanel__additional-editor-caption"
                >
                    {props.extendedCaption}
                </div>
            );
        }
    }
    return null;
});

const ItemTemplate = React.forwardRef((props: IItemProps, ref): React.ReactElement => {
    const notifyPropertyValueChanged = (
        event: SyntheticEvent,
        value: TKey[] | TKey,
        textValue: string
    ) => {
        const newValue = value ?? null;
        const extendedValue = {
            value: props.multiSelect ? [newValue] : newValue,
            textValue,
            viewMode: 'basic',
        };
        props.onPropertyValueChanged?.(event, extendedValue);
    };
    return (
        <>
            {props.separatorVisible !== false ? (
                <span className="controls-FilterViewPanel__frequentItem_separator"></span>
            ) : null}
            <div
                onClick={(event) => {
                    notifyPropertyValueChanged(event, props.id, props.text);
                }}
                data-qa={props.fastDataQa}
                className="tw-cursor-pointer controls-FilterViewPanel__editor_underline ws-ellipsis"
                title={props.text}
            >
                {props.text}
            </div>
        </>
    );
});

const FrequentItems = React.forwardRef(
    (props: IContentTemplate & { frequentItems: IItemProps[] }, ref): React.ReactElement => {
        if (props.frequentItems.length) {
            const templates = [];
            props.frequentItems.map(({ title, id }, index) => {
                templates.push(
                    <ItemTemplate
                        text={title}
                        id={id}
                        key={id}
                        onPropertyValueChanged={props.onPropertyValueChanged}
                        separatorVisible={!props.allItemsIsFrequent || !!index}
                        multiSelect={props.multiSelect}
                        fastDataQa={props.fastDataQa}
                    />
                );
            });
            return templates;
        } else {
            return null;
        }
    }
);

function validateItems(props: IFrequentItemProps): boolean {
    if (!props.items) {
        Logger.error(
            `Controls/filterPanel для фильтра "${props.name}" указана опция frequentItemKey в виде массива,
                 в этом случае необходимо задавать опцию items`,
            this
        );
        return false;
    }
    return true;
}

function getFrequentItems(props: IFrequentItemProps): IItemProps[] {
    let frequentItems = [];
    if (props.frequentItems) {
        frequentItems = props.frequentItems;
    } else if (props.frequentItemKey) {
        if (!props.frequentItemText) {
            const frequentItemKeys =
                props.frequentItemKey instanceof Array
                    ? props.frequentItemKey
                    : [props.frequentItemKey];
            if (validateItems(props)) {
                frequentItemKeys.forEach((id) => {
                    const item = props.items.getRecordById(id);
                    frequentItems.push({
                        title: item.get(props.displayProperty),
                        id,
                    });
                });
            }
        } else {
            frequentItems.push({
                title: props.frequentItemText,
                id: props.frequentItemKey,
            });
        }
    }
    return frequentItems;
}

/**
 * Контрол для отображения быстрого значения
 * @class Controls/_filterPanelEditors/FrequentItem
 * @mixes IFrequentItemOptions
 * @private
 */

function FrequentItem(
    props: IFrequentItemProps,
    ref: React.ForwardedRef<unknown>
): React.ReactElement {
    const frequentItems = getFrequentItems(props);
    const allItemsIsFrequent = props.items?.getCount() === frequentItems.length;
    return (
        <FocusRoot
            as="div"
            ref={ref}
            {...props.attrs}
            onDeactivated={props.onDeactivated}
            className={`${props.attrs?.className} controls-FilterViewPanel__frequentEditor`}
        >
            <div className="tw-flex tw-cursor-default">
                <BeforeContentTemplate
                    beforeContentTemplate={props.beforeContentTemplate}
                    beforeContentTemplateOptions={props.beforeContentTemplateOptions}
                    onKeyDown={props.onKeyDown}
                    frequentItemKey={props.frequentItemKey}
                    onExtendedCaptionClick={props.onExtendedCaptionClick}
                    extendedCaption={props.extendedCaption}
                    allItemsIsFrequent={allItemsIsFrequent}
                />
                <FrequentItems
                    onPropertyValueChanged={props.onPropertyValueChanged}
                    fastDataQa={props.fastDataQa}
                    frequentItems={frequentItems}
                    multiSelect={props.multiSelect}
                    allItemsIsFrequent={allItemsIsFrequent}
                />
            </div>
        </FocusRoot>
    );
}

export default React.forwardRef(FrequentItem);