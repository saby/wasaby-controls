import * as React from 'react';
import { TemplateFunction } from 'UI/Base';
import { Model } from 'Types/entity';
import RadioCircle from './RadioCircle/RadioCircle';
import { IGroups } from '../../RadioGroup';
import { wasabyAttrsToReactDom } from 'UICore/Jsx';
import { default as Async } from 'Controls/Container/Async';

interface IItemTemplateProps extends ICaptionTemplateProps {
    captionPosition?: string;
    displayProperty: string;
    radioCircleVisible?: boolean;
    className?: string;
    onClick?: (e: React.MouseEvent) => void;
    contentTemplate?: React.ReactElement;
    theme: string;
}

interface ICaptionTemplateProps {
    selected: boolean;
    readOnly?: boolean;
    item: Model;
    children?: React.ReactElement;
    contentTemplate?: TemplateFunction;
    groups: IGroups;
    parent: string;
    displayProperty: string;
}

export default React.forwardRef(function ItemTemplate(
    props: IItemTemplateProps,
    forwardedRef: React.LegacyRef<HTMLDivElement>
): React.ReactElement {
    const mainClassName =
        `${props.selected ? ' js-controls-RaidoItem__wrapper__selected' : ''}` +
        ` controls-RadioItem__wrapper_${props.readOnly ? 'disabled' : 'enabled'}` +
        ' ' +
        props.className;
    const attrs = wasabyAttrsToReactDom(props.attrs || {});
    const prepareClassName = mainClassName + ' ' + (attrs.className || '');
    return (
        <span
            ref={forwardedRef}
            {...attrs}
            className={prepareClassName}
            tabIndex={0}
            onClick={props.onClick}
        >
            {props.captionPosition === 'start' && (
                <CaptionTemplate
                    readOnly={props.readOnly}
                    selected={props.selected}
                    item={props.item}
                    displayProperty={props.displayProperty}
                    contentTemplate={props.contentTemplate}
                    children={props.children}
                    groups={props.groups}
                    parent={props.parent}
                />
            )}
            {props.radioCircleVisible !== false && (
                <div className="controls-RadioItem__RadioCircle">
                    <RadioCircle
                        className={`controls-RadioItem__RadioCircle_captionPosition-${
                            props.captionPosition || 'end'
                        }`}
                        readOnly={props.readOnly}
                        selected={props.selected}
                        theme={props.theme}
                    />
                </div>
            )}
            {props.captionPosition !== 'start' && (
                <CaptionTemplate
                    readOnly={props.readOnly}
                    selected={props.selected}
                    item={props.item}
                    displayProperty={props.displayProperty}
                    contentTemplate={props.contentTemplate}
                    children={props.children}
                    groups={props.groups}
                    parent={props.parent}
                />
            )}
        </span>
    );
});

const CaptionTemplate = React.forwardRef(function (
    props: ICaptionTemplateProps,
    forwardedRef: React.LegacyRef<HTMLSpanElement>
) {
    const captionTemplateOptions = {
        className: 'controls-RadioItem__caption',
        item: props.item,
        readOnly: props.readOnly,
        selected: props.selected,
        tabindex: 0,
        groups: props.groups,
        parent: props.parent,
        ref: forwardedRef,
    };
    if (props.children) {
        return React.cloneElement(props.children, {
            ...captionTemplateOptions,
            ...props.children.props,
        });
    }
    if (props.contentTemplate) {
        if (typeof props.contentTemplate === 'string') {
            return (
                <Async
                    templateName={props.contentTemplate}
                    templateOptions={captionTemplateOptions}
                />
            );
        }
        return <props.contentTemplate {...captionTemplateOptions} />;
    }
    // В случаях вставки шаблона через дерективу ws:partial иногда летят невалидные одноименные опции, ставлю защиту.
    const realItemExist = props.item instanceof Model;
    return (
        <span
            ref={forwardedRef}
            className={`controls-RadioItem__caption_${props.selected ? 'selected' : 'unselected'}_${
                props.readOnly ? 'disabled' : 'enabled'
            } controls-RadioItem__caption`}
            tabIndex={0}
        >
            {realItemExist && props.item.get(props.displayProperty || 'title')}
        </span>
    );
});
