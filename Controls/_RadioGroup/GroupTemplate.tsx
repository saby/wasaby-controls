import * as React from 'react';
import { Model } from 'Types/entity';
import { IRadioGroupProps, IGroups } from '../RadioGroup';
import { default as Async } from 'Controls/Container/Async';

interface IGroupTemplateProps {
    _selectKeyChanged: (e, item: Model, keyProperty: string) => void;
    isSelected: (item: Model) => boolean;
    defaultItemTemplate: React.ReactElement;
    groupTemplate: React.ReactElement;
    options: IRadioGroupProps;
    isChildGroup?: boolean;
    direction: string;
    multiline: string;
    parent: string;
    groups: IGroups;
}

export default React.forwardRef(function GroupTemplate(
    props: IGroupTemplateProps,
    forwardedRef: React.LegacyRef<HTMLDivElement>
): React.ReactElement {
    const items = props.groups[props.parent]?.items || [];
    const createItemTemplate = (item: Model, index: number) => {
        const ItemTemplate =
            item.get(props.options.itemTemplateProperty) ||
            props.options.itemTemplate ||
            props.defaultItemTemplate;
        const itemTemplateOptions = {
            onClick: (e) => {
                return props._selectKeyChanged(
                    e,
                    item,
                    props.options.keyProperty
                );
            },
            className:
                `controls-RadioGroup_defaultItem_${props.options.direction}${
                    index !== props.groups[props.parent]?.items.length - 1
                        ? '-padding'
                        : ''
                }` +
                ` controls-RadioItem__wrapper ${
                    !props.options.multiline ? 'ws-flex-shrink-0' : ''
                } ${props.options.itemClassName}`,
            item,
            readOnly: props.options.readOnly || item.get('readOnly'),
            displayProperty: props.options.displayProperty,
            captionPosition: props.options.captionPosition,
            selected: props.isSelected(item),
            radioCircleVisible: props.options.radioCircleVisible,
            tabindex: 0,
        };
        const groupTemplateOptions = {
            groupTemplate: props.groupTemplate,
            defaultItemTemplate: props.defaultItemTemplate,
            _selectKeyChanged: props._selectKeyChanged,
            isSelected: props.isSelected,
            groups: props.groups,
            isChildGroup: true,
            parent: item.get(props.options.keyProperty),
            options: props.options,
        };
        if (typeof ItemTemplate === 'string') {
            return (
                <>
                    <Async
                        templateName={ItemTemplate}
                        templateOptions={itemTemplateOptions}
                    />
                    {item.get(props.options.nodeProperty) && (
                        <props.groupTemplate {...groupTemplateOptions} />
                    )}
                </>
            );
        }
        return (
            <>
                <ItemTemplate {...itemTemplateOptions} />
                {item.get(props.options.nodeProperty) && (
                    <props.groupTemplate {...groupTemplateOptions} />
                )}
            </>
        );
    };
    const viewItems = items.map((item, index) => {
        return createItemTemplate(item, index);
    });

    return (
        <div
            ref={forwardedRef}
            className={`controls-invalid-container ${
                props.isChildGroup ? 'controls-RadioGroup__childGroup' : ''
            }`}
        >
            <div
                className={
                    `controls-RadioGroup__wrapper_${props.options.direction}` +
                    ` controls-RadioGroup__wrapper_${props.options.direction}_${
                        props.options.multiline ? 'multi' : ''
                    }line`
                }
                tabIndex={0}
            >
                {viewItems.map((item) => {
                    return item;
                })}
            </div>
            <div
                className={`${
                    props.options.validationStatus !== 'valid'
                        ? 'controls-invalid-border controls-' +
                          props.options.validationStatus +
                          '-border'
                        : ''
                }`}
            ></div>
        </div>
    );
});
