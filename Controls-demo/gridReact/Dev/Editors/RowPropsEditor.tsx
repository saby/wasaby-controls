import * as React from 'react';

import { TGetRowPropsCallback, IRowProps } from 'Controls/gridReact';

import { ColorStyleSelector } from './selectors/ColorStyleSelector';
import { SizeSelector } from './selectors/SizeSelector';
import BaseEditor from './base/BaseEditor';
import BaseSelector from './base/BaseSelector';
import { VisibilitySelector } from './selectors/VisibilitySelector';
import { BorderStyleSelector } from './selectors/BorderStyleSelector';

interface IEditorProps {
    rowProps: IRowProps;
    onChange: (rowProps: IRowProps) => void;
}

function Editor(props: IEditorProps): React.ReactElement {
    const rowProps = props.rowProps;
    const updateRowProps = (newProps: Partial<IRowProps>) => {
        props.onChange({
            ...rowProps,
            ...newProps,
        });
    };

    return (
        <BaseEditor header={'Row Props Editor'} level={2}>
            <BaseSelector header={'backgroundStyle'}>
                <ColorStyleSelector
                    value={rowProps.backgroundStyle}
                    onChange={(backgroundStyle) => {
                        return updateRowProps({ backgroundStyle });
                    }}
                />
            </BaseSelector>
            <BaseSelector header={'hoverBackgroundStyle'}>
                <ColorStyleSelector
                    value={rowProps.hoverBackgroundStyle}
                    onChange={(hoverBackgroundStyle) => {
                        return updateRowProps({ hoverBackgroundStyle });
                    }}
                />
            </BaseSelector>
            <BaseSelector header={'paddingTop'}>
                <SizeSelector
                    value={rowProps.padding?.top}
                    rangeType={'grid-v-padding'}
                    onChange={(top) => {
                        return updateRowProps({
                            padding: { ...rowProps.padding, top },
                        });
                    }}
                />
            </BaseSelector>
            <BaseSelector header={'paddingBottom'}>
                <SizeSelector
                    value={rowProps.padding?.bottom}
                    rangeType={'grid-v-padding'}
                    onChange={(bottom) => {
                        return updateRowProps({
                            padding: { ...rowProps.padding, bottom },
                        });
                    }}
                />
            </BaseSelector>
            <BaseSelector header={'markerVisible'}>
                <input
                    type={'checkbox'}
                    checked={
                        rowProps.markerVisible === undefined
                            ? true
                            : rowProps.markerVisible
                    }
                    onChange={(event) => {
                        return updateRowProps({
                            markerVisible: event.target.checked,
                        });
                    }}
                />
            </BaseSelector>
            <BaseSelector header={'borderVisibility'}>
                <VisibilitySelector
                    value={rowProps.borderVisibility}
                    onChange={(borderVisibility) => {
                        return updateRowProps({ borderVisibility });
                    }}
                />
            </BaseSelector>
            <BaseSelector header={'borderStyle'}>
                <BorderStyleSelector
                    value={rowProps.borderStyle}
                    onChange={(borderStyle) => {
                        return updateRowProps({ borderStyle });
                    }}
                />
            </BaseSelector>
            <BaseSelector header={'shadowVisibility'}>
                <VisibilitySelector
                    value={rowProps.shadowVisibility}
                    onChange={(shadowVisibility) => {
                        return updateRowProps({ shadowVisibility });
                    }}
                />
            </BaseSelector>
        </BaseEditor>
    );
}

interface IHookResult {
    rowPropsEditor: React.ReactElement;
    getRowProps: TGetRowPropsCallback;
}

export function useRowPropsEditor(
    initialRowProps: Partial<IRowProps> = {}
): IHookResult {
    const [rowProps, setRowProps] = React.useState<IRowProps>(initialRowProps);

    const getRowProps = React.useCallback<TGetRowPropsCallback>(() => {
        return rowProps;
    }, [rowProps]);
    const rowPropsEditor = (
        <Editor rowProps={rowProps} onChange={setRowProps} />
    );

    return { rowPropsEditor, getRowProps };
}
