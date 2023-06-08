import { IMultiSelectableOptions } from 'Controls/interface';
import { IControlOptions } from 'UI/Base';
import 'css!Controls/operations';
import SimpleMultiSelector from './SimpleMultiSelector';
import Checkbox from './MultiSelector/Checkbox';
import { TSelectionCountMode } from 'Controls/interface';
import { TKeysSelection } from '../_interface/ISelectionType';
import { IGetCountCallParams } from 'Controls/_operations/MultiSelector/getCount';
import * as React from 'react';

export interface IMultiSelectorOptions extends IMultiSelectableOptions, IControlOptions {
    selectedKeys: TKeysSelection;
    excludedKeys: TKeysSelection;
    selectedKeysCount: number;
    countLoading?: boolean;
    isAllSelected?: boolean;
    selectionViewMode?: 'all' | 'selected' | 'partial';
    selectedCountConfig?: IGetCountCallParams;
    parentProperty?: string;
    selectionCountMode?: TSelectionCountMode;
    recursiveSelection?: boolean;
    fontColorStyle?: string;
    menuBackgroundStyle?: string;
    menuHoverBackgroundStyle?: string;
    closeButtonVisibility?: boolean;
    fontSize?: string;
    onSelectedTypeChanged?: (selectedType: string) => void;
    onControlResize?(): void;
}

/**
 * Контрол, отображающий чекбокс для массовой отметки записей и выпадающий список, позволяющий отмечать все записи, инвертировать, снимать с них отметку.
 * @remark
 * Полезные ссылки:
 * * {@link /doc/platform/developmentapl/interface-development/controls/list/actions/operations/ руководство разработчика}
 * * {@link https://github.com/saby/wasaby-controls/blob/897d41142ed56c25fcf1009263d06508aec93c32/Controls-default-theme/variables/_operations.less переменные тем оформления}
 *
 * @class Controls/_operations/MultiSelector
 * @extends UI/Base:Control
 *
 * @public
 * @demo Controls-demo/operations/MultiSelector/Index
 */
function MultiSelector(props: IMultiSelectorOptions, ref: React.ForwardedRef<unknown>) {
    return (
        <div
            ref={ref}
            className={`controls_operations_theme-${props.theme} controls-operationsPanelV__multiSelector`}
        >
            <Checkbox
                selectedKeysCount={props.selectedKeysCount}
                isAllSelected={props.isAllSelected}
                selectedKeys={props.selectedKeys}
                onSelectedTypeChanged={props.onSelectedTypeChanged}
            />
            <SimpleMultiSelector
                selectedKeys={props.selectedKeys}
                selectionCountMode={props.selectionCountMode}
                excludedKeys={props.excludedKeys}
                selectedKeysCount={props.selectedKeysCount}
                selectedCountConfig={props.selectedCountConfig}
                menuHoverBackgroundStyle={props.menuHoverBackgroundStyle}
                operationsController={props.operationsController}
                menuBackgroundStyle={props.menuBackgroundStyle}
                closeButtonVisibility={props.closeButtonVisibility}
                onSelectedTypeChanged={props.onSelectedTypeChanged}
                onControlResize={props.onControlResize}
                countLoading={props.countLoading}
                fontColorStyle={props.fontColorStyle}
                fontSize={props.fontSize}
                selectionViewMode={props.selectionViewMode}
                isAllSelected={props.isAllSelected}
            />
        </div>
    );
}

export default React.forwardRef(MultiSelector);
