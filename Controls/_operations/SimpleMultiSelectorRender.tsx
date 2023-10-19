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
import { TKeysSelection, ISelectionObject, TSelectionCountMode } from 'Controls/interface';
import { getAdditionalItems } from './Utils/getAdditionalItems';

const { useMemo, useCallback, forwardRef, useRef, useEffect } = React;

type TCount = null | number | void;

const DEFAULT_CAPTION = rk('Отметить');
const SELECT_ITEM_WITH_COUNTER = [
    {
        id: 'selectAll',
        command: 'selectAll',
        title: rk('Отметить все'),
    },
];
const SELECT_ITEM_WITHOUT_COUNTER = [
    {
        id: 'selectAll',
        command: 'selectAll',
        title: rk('Все'),
    },
];
const DEFAULT_ITEMS = [
    {
        id: 'unselectAll',
        command: 'unselectAll',
        title: rk('Снять'),
    },
];

export interface IMultiSelectorProps extends IControlOptions {
    selectedKeys: TKeysSelection;
    excludedKeys: TKeysSelection;
    selectedKeysCount: TCount;
    countLoading?: boolean;
    isAllSelected?: boolean;
    selectionViewMode?: 'all' | 'selected' | 'partial';
    selectedCountConfig?: IGetCountCallParams;
    parentProperty?: string;
    operationsController?: OperationsController;
    selectionCountMode?: TSelectionCountMode;
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
    isAllSelected: boolean
): string {
    const hasSelected = !!selected.length;
    let caption;

    if (hasSelected) {
        if (count > 0) {
            caption = rk('Отмечено') + ' ' + count;
        } else if (isAllSelected) {
            caption = rk('Отмечено все');
        } else if (count === null) {
            caption = rk('Отмечено');
        } else {
            caption = DEFAULT_CAPTION;
        }
    } else {
        caption = DEFAULT_CAPTION;
    }

    return caption;
}
const customEvents = ['onMenuItemActivate'];
function SimpleMultiSelectorRender(
    props: IMultiSelectorProps & {
        loading: boolean;
    },
    ref: React.ForwardedRef<unknown>
): JSX.Element {
    const indicatorRef = useRef<LoadingIndicator>(null);
    const menuItems = useMemo(() => {
        const isItemsSelected = props.isAllSelected || Number(props.selectedKeysCount) !== 0;
        const selectItem = isItemsSelected ? SELECT_ITEM_WITH_COUNTER : SELECT_ITEM_WITHOUT_COUNTER;
        return new RecordSet({
            keyProperty: 'id',
            rawData: [
                ...selectItem,
                ...DEFAULT_ITEMS,
                ...getAdditionalItems(
                    props.selectionViewMode,
                    props.isAllSelected,
                    props.selectedKeys,
                    props.selectedKeysCount as number
                ),
            ],
        });
    }, [props.selectionViewMode, props.isAllSelected, props.selectedKeys, props.selectedKeysCount]);

    const menuCaption = useMemo(() => {
        return getMenuCaption(
            {
                selected: props.selectedKeys,
                excluded: props.excludedKeys,
            },
            props.selectedKeysCount,
            props.isAllSelected
        );
    }, [props.selectedKeysCount, props.isAllSelected, props.excludedKeys, props.selectedKeys]);

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
