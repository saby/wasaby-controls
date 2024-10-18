import * as React from 'react';
import { Model } from 'Types/entity';
import { TGetRowPropsCallback, useItemData } from 'Controls/gridReact';
import { IBaseGroupTemplate } from 'Controls/baseList';
import BaseEditor from '../Dev/Editors/base/BaseEditor';
import BaseSelector from '../Dev/Editors/base/BaseSelector';
import { useTumbler } from '../Dev/Editors/Tumbler';
import { Money } from 'Controls/baseDecorator';
import { SizeSelector } from 'Controls-demo/gridReact/Dev/Editors/selectors/SizeSelector';
import { ColorStyleSelector } from 'Controls-demo/gridReact/Dev/Editors/selectors/ColorStyleSelector';

export interface IGroupDemoProps {
    getRowProps?: TGetRowPropsCallback;
}

interface IGroupDemoEditorProps<T> extends IGroupDemoProps {
    value: T;
    onChange: Function;
}

interface IRightTemplateProps {
    item?: Model;
}

function RightTemplate(props: IRightTemplateProps): React.ReactElement {
    return <Money value={12345} fontColorStyle={'group'} useGrouping={false} />;
}

export function useCheckboxEditor(
    optionName: string,
    initialValue: boolean,
    onChange: (v: boolean) => void
): React.ReactElement {
    const [state, setState] = React.useState<boolean>(initialValue);
    return (
        <BaseSelector header={optionName}>
            <input
                type={'checkbox'}
                checked={state === undefined ? true : state}
                onChange={(event) => {
                    setState(event.target.checked);
                    onChange(event.target.checked);
                }}
            />
        </BaseSelector>
    );
}

export function GroupPropsEditors(
    props: IGroupDemoEditorProps<IBaseGroupTemplate>
): React.ReactElement {
    const [state, setState] = React.useState({
        hasRightTemplate: false,
    });
    const onChange = (optionName: string, value: unknown) => {
        props.onChange({
            ...props.value,
            [optionName]: value,
        });
    };
    const expanderAlignTumbler = useTumbler(
        'expanderAlign',
        ['left', 'right'],
        props.value.expanderAlign || 'left',
        (v) => {
            onChange('expanderAlign', v);
        }
    )[1];
    const textAlignTumbler = useTumbler(
        'halign',
        ['start', 'center', 'end'],
        props.value.halign || 'center',
        (v) => {
            onChange('halign', v);
        }
    )[1];
    const fontWeightTumbler = useTumbler(
        'fontWeight',
        ['default', 'normal', 'bold'],
        props.value.fontWeight || 'default',
        (v) => {
            onChange('fontWeight', v);
        }
    )[1];
    const textTransformTumbler = useTumbler(
        'textTransform',
        ['none', 'uppercase'],
        props.value.textTransform || 'default',
        (v) => {
            onChange('textTransform', v);
        }
    )[1];
    const separatorVisibleCheckbox = useCheckboxEditor(
        'separatorVisible',
        props.value.separatorVisible,
        (v) => {
            onChange('separatorVisible', v);
        }
    );
    const expanderVisibleCheckbox = useCheckboxEditor(
        'expanderVisible',
        props.value.expanderVisible,
        (v) => {
            onChange('expanderVisible', v);
        }
    );
    const textVisibleCheckbox = useCheckboxEditor('textVisible', props.value.textVisible, (v) => {
        onChange('textVisible', v);
    });

    const hasRightTemplate = useCheckboxEditor('has rightTemplate', state.hasRightTemplate, (v) => {
        if (v) {
            onChange('rightTemplate', RightTemplate);
        } else {
            onChange('rightTemplate', undefined);
        }
        setState({
            ...state,
            hasRightTemplate: v,
        });
    });

    // contentTemplate ? :;
    return (
        <BaseEditor header={'Group editor'} level={1}>
            {expanderAlignTumbler}
            {textAlignTumbler}
            {separatorVisibleCheckbox}
            {expanderVisibleCheckbox}
            {textVisibleCheckbox}
            {hasRightTemplate}
            <BaseSelector header={'fontSize'}>
                <SizeSelector
                    value={props.value.fontSize}
                    onChange={(v) => {
                        onChange('fontSize', v);
                    }}
                />
            </BaseSelector>
            <BaseSelector header={'fontColorStyle'}>
                <ColorStyleSelector
                    value={props.value.fontColorStyle}
                    onChange={(v) => {
                        onChange('fontColorStyle', v);
                    }}
                />
            </BaseSelector>
            {fontWeightTumbler}
            {textTransformTumbler}
            <BaseSelector header={'iconSize'}>
                <SizeSelector
                    value={props.value.iconSize}
                    onChange={(v) => {
                        onChange('iconSize', v);
                    }}
                />
            </BaseSelector>
            <BaseSelector header={'iconStyle'}>
                <ColorStyleSelector
                    value={props.value.iconStyle}
                    onChange={(v) => {
                        onChange('iconStyle', v);
                    }}
                />
            </BaseSelector>
        </BaseEditor>
    );
}
