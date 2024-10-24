/**
 * @kaizen_zone 9377bd5b-f96c-43f4-bb99-324d7bfb4363
 */
import * as React from 'react';
import GridSelectionContextProviderMemo, {
    IGridSelectionContextProviderProps,
} from './selectionContext/gridSelectionContext/GridSelectionContextProvider';
import DragSelectionContextProviderMemo, {
    IDragSelectionContextProviderProps,
} from './dragSelection/dragSelectionContext/DragSelectionContextProvider';
import { TColumnKeys } from '../shared/types';

export { ISelection } from './SelectionModel';

export interface IGridSelectionContainerProps
    extends Omit<IGridSelectionContextProviderProps, 'columns'>,
        Omit<IDragSelectionContextProviderProps, 'containerRef'> {
    columns: TColumnKeys;
}

function SelectionContainer(props: IGridSelectionContainerProps): JSX.Element {
    const containerRef = React.useRef<HTMLDivElement>();

    const columns = React.useMemo(
        () =>
            props.columns.map((c) => {
                // TODO тут намешаны даты из таймлайна. Этого быть не должно
                return typeof (c as unknown as Date).getMonth === 'function'
                    ? (c as unknown as Date).toUTCString()
                    : c;
            }),
        [props.columns]
    );

    return (
        <div className="tw-contents" ref={containerRef}>
            <GridSelectionContextProviderMemo
                collectionRef={props.collectionRef}
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

const SelectionContainerMemo = React.memo((props: IGridSelectionContainerProps) => {
    return <SelectionContainer {...props} />;
});

export default SelectionContainerMemo;
