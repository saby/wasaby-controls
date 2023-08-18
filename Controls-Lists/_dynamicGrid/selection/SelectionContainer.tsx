import * as React from 'react';
import GridSelectionContextProviderMemo, {
    IGridSelectionContextProviderProps,
    TMultiSelectAccessibilityCallback as TCellsMultiSelectAccessibilityCallback,
    TMultiSelectVisibility as TCellsMultiSelectVisibility,
} from './selectionContext/gridSelectionContext/GridSelectionContextProvider';
import DragSelectionContextProviderMemo, {
    IDragSelectionContextProviderProps,
} from './dragSelection/dragSelectionContext/DragSelectionContextProvider';
import { TColumnKeys } from '../shared/types';

export { ISelection } from './SelectionModel';
export { TCellsMultiSelectVisibility, TCellsMultiSelectAccessibilityCallback };

export interface IGridSelectionContainerProps
    extends Omit<IGridSelectionContextProviderProps, 'columns'>,
        Omit<IDragSelectionContextProviderProps, 'containerRef'> {
    className?: string;
    columns: TColumnKeys;
}

function SelectionContainer(props: IGridSelectionContainerProps): JSX.Element {
    const containerRef = React.useRef<HTMLDivElement>();

    let className = 'tw-contents';

    if (props.className) {
        className += ` ${props.className}`;
    }

    const columns = React.useMemo(
        () => props.columns.map((c) => (c as unknown as Date).toUTCString()),
        [props.columns]
    );

    return (
        <div className={className} ref={containerRef}>
            <GridSelectionContextProviderMemo
                collection={props.collection}
                itemsSpacing={props.itemsSpacing}
                columnsSpacing={props.columnsSpacing}
                multiSelectVisibility={props.multiSelectVisibility}
                multiSelectAccessibilityCallback={props.multiSelectAccessibilityCallback}
                columns={columns}
                selection={props.selection}
                onSelectionChanged={props.onSelectionChanged}
                onBeforeSelectionChange={props.onBeforeSelectionChange}
            >
                <DragSelectionContextProviderMemo
                    itemSelector={props.itemSelector}
                    itemKeyAttribute={props.itemKeyAttribute}
                    itemSelectorMask={props.itemSelectorMask}
                    columnSelector={props.columnSelector}
                    columnSelectorMask={props.columnSelectorMask}
                    columnKeyAttribute={props.columnKeyAttribute}
                    children={props.children}
                    containerRef={containerRef}
                />
            </GridSelectionContextProviderMemo>
        </div>
    );
}

const SelectionContainerMemo = React.memo(SelectionContainer);
export default SelectionContainerMemo;
