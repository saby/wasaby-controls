/**
 * @kaizen_zone 620ede61-d6a1-43c3-b811-f368d16d19f5
 */
import * as React from 'react';
import { IFrequentItemOptions } from './IFrequentItem';
import { TKey } from 'Controls/interface';
import { SyntheticEvent } from 'UICommon/Events';
import { FocusRoot } from 'UI/Focus';
import 'css!Controls/filterPanel';

interface IFrequentItemProps extends IFrequentItemOptions {
    onExtendedCaptionClick?: Function;
    onPropertyValueChanged?: Function;
    beforeContentTemplate?: React.ReactElement;
    beforeContentTemplateOptions?: object;
    extendedCaption?: string;
    fastDataQa?: string;
}

/**
 * Контрол для отображения быстрого значения
 * @class Controls/_filterPanel/Editors/FrequentItem
 * @extends UI/Base:Control
 * @mixes IFrequentItemOptions
 * @private
 */

function FrequentItem(
    props: IFrequentItemProps,
    ref: React.ForwardedRef<unknown>
): React.ReactElement {
    const notifyPropertyValueChanged = (
        event: SyntheticEvent,
        value: TKey[] | TKey,
        textValue: string
    ) => {
        const extendedValue = {
            value: value || null,
            textValue,
            viewMode: 'basic',
        };
        (props.onPropertyValueChanged || props.onPropertyvaluechanged)?.(
            event,
            extendedValue
        );
    };

    return (
        <FocusRoot
            as="div"
            ref={ref}
            {...props.attrs}
            onDeactivated={props.onDeactivated}
            className={`${props.attrs?.className} controls-FilterViewPanel__frequentEditor`}
        >
            <div className="ws-flexbox">
                {props.beforeContentTemplate ? (
                    <props.beforeContentTemplate
                        {...props.beforeContentTemplateOptions}
                    />
                ) : (
                    <div
                        className={
                            props.frequentItemText
                                ? 'ws-flex-shrink-0 controls-FilterViewPanel__editor_underline'
                                : 'ws-ellipsis'
                        }
                        onClick={() => {
                            (
                                props.onExtendedCaptionClick ||
                                props.onExtendedcaptionclick
                            )?.();
                        }}
                        title={props.extendedCaption}
                        data-qa="FilterViewPanel__additional-editor-caption"
                    >
                        {props.extendedCaption}
                    </div>
                )}
                {props.frequentItemText ? (
                    <>
                        <span className="controls-FilterViewPanel__frequentItem_separator"></span>
                        <div
                            onClick={(event) => {
                                notifyPropertyValueChanged(
                                    event,
                                    props.frequentItemKey,
                                    props.frequentItemText
                                );
                            }}
                            data-qa={props.fastDataQa}
                            className="controls-FilterViewPanel__editor_underline ws-ellipsis"
                        >
                            {props.frequentItemText}
                        </div>
                    </>
                ) : null}
            </div>
        </FocusRoot>
    );
}

export default React.forwardRef(FrequentItem);
