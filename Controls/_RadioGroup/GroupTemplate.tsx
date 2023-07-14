import * as React from 'react';
import { Model } from 'Types/entity';
import { IRadioGroupProps, IGroups } from '../RadioGroup';
import { default as Async } from 'Controls/Container/Async';
import { useReadonly } from 'UI/Contexts';

interface IGroupTemplateProps extends IRadioGroupProps {
    _selectKeyChanged: (e, item: Model, keyProperty: string) => void;
    isSelected: (item: Model) => boolean;
    defaultItemTemplate: React.ReactElement;
    groupTemplate: React.ReactElement;
    isChildGroup?: boolean;
    parent: string;
    groups: IGroups;
}

export default React.forwardRef(function GroupTemplate(
    props: IGroupTemplateProps,
    forwardedRef: React.LegacyRef<HTMLDivElement>
): React.ReactElement {
    const items = props.groups[props.parent]?.items || [];
    const readOnly = useReadonly(props);
    const createItemTemplate = (item: Model, index: number) => {
        const ItemTemplate =
            item.get(props.itemTemplateProperty) ||
            props.itemTemplate ||
            props.defaultItemTemplate;
        const itemTemplateOptions = {
            onClick: (e) => {
                return props._selectKeyChanged(e, item, props.keyProperty);
            },
            className:
                `controls-RadioGroup_defaultItem_${props.direction}${
                    index !== props.groups[props.parent]?.items.length - 1 ? '-padding' : ''
                }` +
                ` controls-RadioItem__wrapper ${
                    !props.multiline ? 'ws-flex-shrink-0' : ''
                } ${props.itemClassName}`,
            item,
            readOnly: readOnly || item.get('readOnly'),
            displayProperty: props.displayProperty,
            captionPosition: props.captionPosition,
            selected: props.isSelected(item),
            radioCircleVisible: props.radioCircleVisible,
            tabindex: 0,
            multiline: props.direction === 'vertical' ? props.multiline : undefined
        };
        const groupTemplateOptions = {
            groupTemplate: props.groupTemplate,
            defaultItemTemplate: props.defaultItemTemplate,
            _selectKeyChanged: props._selectKeyChanged,
            isSelected: props.isSelected,
            groups: props.groups,
            isChildGroup: true,
            parent: item.get(props.keyProperty),
            itemTemplateProperty: props.itemTemplateProperty,
            itemTemplate: props.itemTemplate,
            keyProperty: props.keyProperty,
            direction: props.direction,
            multiline: props.multiline,
            itemClassName: props.itemClassName,
            displayProperty: props.displayProperty,
            captionPosition: props.captionPosition,
            radioCircleVisible: props.radioCircleVisible,
            validationStatus: props.validationStatus,
            nodeProperty: props.nodeProperty
        };
        if (typeof ItemTemplate === 'string') {
            return (
                <>
                    <Async templateName={ItemTemplate} templateOptions={itemTemplateOptions} />
                    {item.get(props.nodeProperty) && (
                        <props.groupTemplate {...groupTemplateOptions} />
                    )}
                </>
            );
        }
        return (
            <>
                <ItemTemplate {...itemTemplateOptions} />
                {item.get(props.nodeProperty) && (
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
                    `controls-RadioGroup__wrapper_${props.direction}` +
                    ` controls-RadioGroup__wrapper_${props.direction}_${
                        props.multiline ? 'multi' : ''
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
                    props.validationStatus !== 'valid'
                        ? 'controls-invalid-border controls-' +
                          props.validationStatus +
                          '-border'
                        : ''
                }`}
            ></div>
        </div>
    );
});
