import * as React from 'react';

import { Model } from 'Types/entity';

import { IGridProps, IColumnConfig } from 'Controls/gridReact';
import { TColspanCallback } from 'Controls/grid';

import BaseEditor from './base/BaseEditor';
import BaseSelector from './base/BaseSelector';
import { VisibilitySelector } from './selectors/VisibilitySelector';
import { OrientationSelector } from './selectors/OrientationSelector';
import { ActionCaptionPositionSelector } from './selectors/ActionCaptionPositionSelector';
import { ActionsPositionSelector } from './selectors/ActionsPositionSelector';
import { ActionsVisibilitySelector } from './selectors/ActionsVisibilitySelector';

const COLSPAN_CALLBACK: TColspanCallback = (
    item: Model,
    column: IColumnConfig,
    columnIndex: number,
    isEditing: boolean
) => {
    if (item.getKey() === 1 && columnIndex === 0) {
        return 'end';
    }
    if (item.getKey() === 2 && columnIndex === 0) {
        return 2;
    }
    if (item.getKey() === 3 && columnIndex === 1) {
        return 2;
    }
};

interface IEditorProps {
    gridProps: Partial<IGridProps>;
    onChange: (gridProps: Partial<IGridProps>) => void;
}

function Editor(props: IEditorProps): React.ReactElement {
    const gridProps = props.gridProps;
    const updateGridProps = (newProps: Partial<IGridProps>) => {
        props.onChange({
            ...gridProps,
            ...newProps,
        });
    };

    return (
        <BaseEditor header={'Grid Props Editor'} level={2}>
            <BaseSelector header={'multiSelectVisibility'}>
                <VisibilitySelector
                    value={gridProps.multiSelectVisibility}
                    onChange={(multiSelectVisibility) => {
                        return updateGridProps({ multiSelectVisibility });
                    }}
                />
            </BaseSelector>
            <BaseSelector header={'itemActionsPosition'}>
                <ActionsPositionSelector
                    value={gridProps.itemActionsPosition}
                    onChange={(itemActionsPosition) => {
                        return updateGridProps({ itemActionsPosition });
                    }}
                />
            </BaseSelector>
            <BaseSelector header={'actionAlignment'}>
                <OrientationSelector
                    value={gridProps.actionAlignment}
                    onChange={(actionAlignment) => {
                        return updateGridProps({ actionAlignment });
                    }}
                />
            </BaseSelector>
            <BaseSelector header={'actionCaptionPosition'}>
                <ActionCaptionPositionSelector
                    value={gridProps.actionCaptionPosition}
                    onChange={(actionCaptionPosition) => {
                        return updateGridProps({ actionCaptionPosition });
                    }}
                />
            </BaseSelector>
            <BaseSelector header={'itemActionsVisibility'}>
                <ActionsVisibilitySelector
                    value={gridProps.itemActionsVisibility}
                    onChange={(itemActionsVisibility) => {
                        return updateGridProps({ itemActionsVisibility });
                    }}
                />
            </BaseSelector>
            <BaseSelector header={'contextMenuVisibility'}>
                <input
                    type={'checkbox'}
                    checked={
                        gridProps.contextMenuVisibility === undefined
                            ? true
                            : gridProps.contextMenuVisibility
                    }
                    onChange={(event) => {
                        return updateGridProps({
                            contextMenuVisibility: event.target.checked,
                        });
                    }}
                />
            </BaseSelector>
            <BaseSelector header={'colspanCallback'}>
                <input
                    type={'checkbox'}
                    checked={!!gridProps.colspanCallback}
                    onChange={(event) => {
                        return updateGridProps({
                            colspanCallback: event.target.checked
                                ? COLSPAN_CALLBACK
                                : null,
                        });
                    }}
                />
            </BaseSelector>
        </BaseEditor>
    );
}

interface IHookResult {
    gridPropsEditor: React.ReactElement;
    gridProps: Partial<IGridProps>;
}

export function useGridPropsEditor(
    initialGridProps: Partial<IGridProps> = {}
): IHookResult {
    const [gridProps, setGridProps] =
        React.useState<Partial<IGridProps>>(initialGridProps);

    const gridPropsEditor = (
        <Editor gridProps={gridProps} onChange={setGridProps} />
    );

    return {
        gridPropsEditor,
        gridProps,
    };
}
