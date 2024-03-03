import { IControlOptions } from 'UI/Base';
import * as React from 'react';
import { default as OperationsController } from './ControllerClass';
import { Model } from 'Types/entity';
import { default as LoadingIndicator } from 'Controls/LoadingIndicator';
import { Button } from 'Controls/dropdown';
import 'css!Controls/operations';
import * as rk from 'i18n!Controls';
import { RecordSet } from 'Types/collection';
import { IGetCountCallParams } from 'Controls/_operations/MultiSelector/getCount';
import {
    TKeysSelection,
    ISelectionObject,
    TSelectionCountMode,
    ISelectionViewModeOptions,
    TSelectionViewMode,
} from 'Controls/interface';
import { getAdditionalItems } from './Utils/getAdditionalItems';

const { useMemo, useCallback, forwardRef, useRef, useEffect } = React;

type TCount = null | number | void;

const DEFAULT_CAPTION = rk('Отметить');

export interface IMultiSelectorProps extends IControlOptions, ISelectionViewModeOptions {
    selectedKeys: TKeysSelection;
    excludedKeys: TKeysSelection;
    selectedKeysCount: TCount;
    showSelectedCount?: TCount;
    countLoading?: boolean;
    isAllSelected?: boolean;
    selectedCountConfig?: IGetCountCallParams;
    parentProperty?: string;
    operationsController?: OperationsController;
    selectionCountMode?: TSelectionCountMode;
    supportSelection?: boolean;
    recursiveSelection?: boolean;
    fontColorStyle?: string;
    menuBackgroundStyle?: string;
    menuHoverBackgroundStyle?: string;
    closeButtonVisibility?: boolean;
    fontSize?: string;
    onSelectedTypeChanged?: (itemId: string) => void;

    onControlResize?(): void;
}

function getMenuCaption(
    { selected }: ISelectionObject,
    count: TCount,
    isAllSelected: boolean,
    selectionViewMode?: TSelectionViewMode,
    showSelectedCount?: number,
    loading?: boolean
): string {
    const hasSelected = !!selected.length;
    let caption;

    if (hasSelected && (count !== 0 || isAllSelected)) {
        if (count > 0) {
            caption = rk('Отмечено') + ' ' + count;
        } else if (isAllSelected && count !== 0) {
            caption = rk('Отмечено все');
        } else if (count === null || loading) {
            caption = rk('Отмечено');
        } else {
            caption = DEFAULT_CAPTION;
        }
    } else if (selectionViewMode === 'selected') {
        caption = rk('Отобрано');

        if (showSelectedCount > 0) {
            caption += ' ' + showSelectedCount;
        }
    } else {
        caption = DEFAULT_CAPTION;
    }

    return caption;
}
const customEvents = ['onMenuItemActivate'];

/**
 * Контрол отображающий выпадающий список, который позволяет отмечать все записи, инвертировать, снимать с них отметку.
 * Для автоматической связи со списком используйте {@link Controls-ListEnv/operationsConnected:SimpleMultiSelector}
 * @class Controls/_operations/SimpleMultiSelectorRender
 * @remark
 * Полезные ссылки:
 * * {@link /doc/platform/developmentapl/interface-development/controls/list/actions/operations/ руководство разработчика}
 * * {@link https://github.com/saby/wasaby-controls/blob/rc-20.4000/Controls-default-theme/variables/_operations.less переменные тем оформления}
 *
 * @demo Controls-ListEnv-demo/OperationsConnected/SimpleMultiSelector/Index
 * @public
 */
function SimpleMultiSelectorRender(
    props: IMultiSelectorProps & {
        loading: boolean;
    },
    ref: React.ForwardedRef<unknown>
): JSX.Element {
    const indicatorRef = useRef<LoadingIndicator>(null);
    const menuItems = useMemo(() => {
        return new RecordSet({
            keyProperty: 'id',
            rawData: [
                ...getAdditionalItems(
                    props.selectionViewMode,
                    props.isAllSelected,
                    props.selectedKeys,
                    props.selectedKeysCount as number,
                    props.supportSelection
                ),
            ],
        });
    }, [
        props.selectionViewMode,
        props.isAllSelected,
        props.selectedKeys,
        props.selectedKeysCount,
        props.supportSelection,
    ]);

    const menuCaption = useMemo(() => {
        return getMenuCaption(
            {
                selected: props.selectedKeys,
                excluded: props.excludedKeys,
            },
            props.selectedKeysCount,
            props.isAllSelected,
            props.selectionViewMode,
            props.showSelectedCount,
            props.loading
        );
    }, [
        props.selectedKeysCount,
        props.isAllSelected,
        props.excludedKeys,
        props.selectedKeys,
        props.selectionViewMode,
        props.showSelectedCount,
        props.loading,
    ]);

    const onMenuItemActivate = useCallback(
        (item: Model) => {
            const itemId: string = item.get('command');
            props.onSelectedTypeChanged(itemId);
        },
        [props.onSelectedTypeChanged]
    );

    useEffect(() => {
        if (indicatorRef.current) {
            if (props.loading) {
                indicatorRef.current.show();
            } else {
                indicatorRef.current.hide();
            }
        }
    }, [props.loading]);

    useEffect(() => {
        const indicator = indicatorRef;
        return () => {
            if (indicator.current) {
                indicator.current.hide();
            }
        };
    }, []);

    return (
        <div
            className={`controls_operations_theme-${props.theme} controls-operationsPanelV__container`}
        >
            <Button
                keyProperty={'id'}
                viewMode={'link'}
                forwardedRef={ref}
                data-qa={'controls-operations__simpleMultiSelector'}
                buttonStyle={'secondary'}
                fontColorStyle={props.fontColorStyle}
                menuHoverBackgroundStyle={props.menuHoverBackgroundStyle}
                menuBackgroundStyle={props.menuBackgroundStyle}
                caption={menuCaption}
                fontSize={props.fontSize}
                closeButtonVisibility={props.closeButtonVisibility}
                onMenuItemActivate={onMenuItemActivate}
                customEvents={customEvents}
                items={menuItems}
                className={`controls-MultiSelector__button ${props.attrs?.className}`}
            />
            <LoadingIndicator
                ref={indicatorRef}
                isGlobal={false}
                small={true}
                overlay={'none'}
                className={'controls-operationsPanelV__loadingIndicatorImg-wrapper'}
            >
                <div></div>
            </LoadingIndicator>
        </div>
    );
}

const forwardedComponent = forwardRef(SimpleMultiSelectorRender);

forwardedComponent.defaultProps = {
    selectedKeys: [],
    excludedKeys: [],
    fontColorStyle: 'operationsPanel',
};

export default forwardedComponent;
