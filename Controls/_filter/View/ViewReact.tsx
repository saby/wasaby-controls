import * as rk from 'i18n!Controls';
import * as React from 'react';
import { Button } from 'Controls/buttons';
import DateRangeEditor from 'Controls/_filter/Editors/DateRange';
import { IFilterViewOptions } from './interface/IFilterView';
import { IFilterItemConfigs } from '../View';
import IFilterItem from 'Controls/_filter/interface/IFilterDescriptionItem';
import { isEqual } from 'Types/object';
import { DesignContext } from 'Controls/design';
import { getWasabyContext, useReadonly } from 'UI/Contexts';

export interface IFilterViewProps extends IFilterViewOptions {
    displayText: string;
    configs: IFilterItemConfigs;
    filterText?: string;
    showFilterText?: boolean;
    isAdaptive: boolean;

    alignmentClass: string;
    needShowFastFilter: boolean;
    needShowDetailPanelTarget: boolean;
    needShowResetCross: boolean;
    allChangedFilterTextValueInvisible?: boolean;
    primaryFilter: boolean;
    isFastReseted: boolean;
    isAllFastReseted: boolean;
    isFiltersReseted: boolean;

    dateRangeItem: IFilterItem;

    startLoadDependencies: Function;
    openDetailPanel: Function;
    openPanel: Function;
    textValueHandler: Function;
    dateRangeHandler: Function;
    resetFrequentItem: Function;
    resetFilter: Function;
    resetFilterText: Function;
}

function DetailPanelTarget(props: Partial<IFilterViewProps>): React.ReactElement | null {
    const openDetailPanel = React.useCallback(() => {
        props.openDetailPanel('emptyTextTarget');
    }, [props.openDetailPanel]);

    if (props.needShowDetailPanelTarget && props.emptyText && !props.detailPanelTemplateName) {
        return (
            <props.itemTemplate
                name="emptyTextTarget"
                itemName="emptyTextTarget"
                readOnly={props.readOnly}
                theme={props.theme}
                text={props.emptyText}
                title={props.emptyText}
                className={`controls-FilterView__emptyText ${
                    'controls-FilterView-' + props.alignment + '__block'
                }`}
                onMouseDown={openDetailPanel}
            />
        );
    }
    return null;
}

const ResetButton = React.forwardRef((props: { reset: Function }, ref) => {
    return (
        <span
            ref={ref}
            className="controls-FilterView__iconReset icon-CloseNew"
            ws-no-focus="true"
            onMouseDown={props.reset}
            title={rk('Сбросить')}
            data-qa="FilterView__iconReset"
        ></span>
    );
});
const FilterButtonText = React.forwardRef((props: Partial<IFilterViewProps>, ref) => {
    const openDetailPanel = React.useCallback(() => {
        props.openDetailPanel();
    }, [props.openDetailPanel]);
    if (props.filterText) {
        return (
            <>
                <props.itemTemplate
                    ref={ref}
                    readOnly={props.readOnly}
                    theme={props.theme}
                    text={props.filterText}
                    title={props.filterText}
                    onMouseDown={openDetailPanel}
                    className={`controls-FilterView__filterTextLine ${props.alignmentClass}`}
                />
                {props.needShowResetCross && !props.readOnly ? (
                    <ResetButton reset={props.resetFilterText} />
                ) : null}
            </>
        );
    }
    return null;
});

const ItemTemplate = React.forwardRef(
    (
        props: Partial<IFilterViewProps> & {
            itemConfig: IFilterItem;
            resetButtonVisible?: boolean;
        },
        ref
    ) => {
        const itemConfig = props.itemConfig;
        const onMouseDown = React.useCallback(
            (event) => {
                props.openPanel(event, itemConfig.name);
            },
            [props.openPanel, itemConfig.name]
        );

        const onReset = React.useCallback(() => {
            props.resetFrequentItem(itemConfig);
        }, [props.resetFrequentItem, itemConfig]);

        return (
            <>
                <props.itemTemplate
                    readOnly={props.readOnly}
                    theme={props.theme}
                    text={props.displayText[itemConfig.name].text}
                    title={props.displayText[itemConfig.name].title}
                    moreText={props.displayText[itemConfig.name].hasMoreText}
                    onMouseDown={onMouseDown}
                    name={itemConfig.name}
                    item={itemConfig}
                    itemName={itemConfig.name}
                    className={`controls-FilterView__frequentFilter ${props.alignmentClass}`}
                />
                {props.resetButtonVisible !== false &&
                itemConfig.hasOwnProperty('resetValue') &&
                !props.readOnly ? (
                    <ResetButton reset={onReset} />
                ) : null}
            </>
        );
    }
);

function PrimaryFrequentFilter(props: Partial<IFilterViewProps>) {
    const item = props.primaryFilter;
    if (item) {
        return (
            <ItemTemplate
                itemConfig={item}
                itemTemplate={props.itemTemplate}
                openPanel={props.openPanel}
                resetFrequentItem={props.resetFrequentItem}
                readOnly={props.readOnly}
                theme={props.theme}
                displayText={props.displayText}
                alignmentClass={props.alignmentClass}
                resetButtonVisible={!isEqual(item.value, item.resetValue)}
                key={item.name}
            />
        );
    } else {
        return null;
    }
}

const FrequentFilter = function (props: Partial<IFilterViewProps>): React.ReactElement | null {
    const onMouseDown = React.useCallback(
        (event) => {
            props.openPanel(event, 'all_frequent');
        },
        [props.openPanel]
    );

    if (props.needShowFastFilter) {
        const itemsTemplates = [];
        props.source.forEach((item, index) => {
            const hasItems = props.configs[item.name]?.items?.getCount();
            if (
                !item.primary &&
                ((hasItems && props.displayText[item.name]?.text !== undefined) ||
                    props.displayText[item.name]?.text)
            ) {
                itemsTemplates.push(
                    <ItemTemplate
                        itemConfig={item}
                        itemTemplate={props.itemTemplate}
                        openPanel={props.openPanel}
                        resetFrequentItem={props.resetFrequentItem}
                        readOnly={props.readOnly}
                        theme={props.theme}
                        displayText={props.displayText}
                        alignmentClass={props.alignmentClass}
                        key={item.name}
                    />
                );
            }
        });

        return (
            <>
                {props.detailPanelTemplateName &&
                ((props.emptyText &&
                    props.emptyText + '' !== rk('Все') + '' &&
                    props.isFastReseted) ||
                    props.isFiltersReseted) ? (
                    <props.itemTemplate
                        name="all_frequent"
                        itemName="all_frequent"
                        readOnly={props.readOnly}
                        theme={props.theme}
                        text={props.emptyText || rk('Все')}
                        className={`controls-FilterView__frequentFilter ${props.alignmentClass}`}
                        onMouseDown={onMouseDown}
                    />
                ) : null}
                {itemsTemplates}
            </>
        );
    }
    return null;
};

const DateRangeItem = React.forwardRef((props: Partial<IFilterViewProps>, ref) => {
    const { dateRangeItem } = props;

    const onMouseDown = React.useCallback(
        (event) => {
            props.openPanel(event, dateRangeItem?.name);
        },
        [props.openPanel, dateRangeItem?.name]
    );

    const onReset = React.useCallback(() => {
        props.resetFrequentItem(dateRangeItem);
    }, [props.resetFrequentItem]);

    if (
        !dateRangeItem ||
        (dateRangeItem.filterVisibilityCallback && dateRangeItem.visibility === false)
    ) {
        return null;
    }

    const isFilterButtonVisible =
        props.needShowDetailPanelTarget && (!props.emptyText || props.detailPanelTemplateName);
    const isOnlyDateInFilter = props.source.length === 1 && !props.needShowFastFilter;
    const fontWeight = isFilterButtonVisible
        ? 'default'
        : (isOnlyDateInFilter && 'bold') || undefined;

    if (dateRangeItem.viewMode !== 'extended') {
        if (dateRangeItem.type === 'dateMenu') {
            const isResetButtonVisible =
                dateRangeItem.hasOwnProperty('resetValue') &&
                !isEqual(dateRangeItem.resetValue, dateRangeItem.value);
            const text =
                dateRangeItem.textValue ||
                dateRangeItem.editorOptions?.emptyCaption ||
                dateRangeItem.emptyText;

            return (
                <>
                    <props.itemTemplate
                        theme={props.theme}
                        text={text}
                        title={text}
                        onMouseDown={onMouseDown}
                        name={dateRangeItem.name}
                        item={dateRangeItem}
                        itemName={dateRangeItem.name}
                        ref={ref}
                        className={`controls-FilterView__DateMenuEditor ${props.alignmentClass}`}
                    />
                    {isResetButtonVisible && !props.readOnly ? (
                        <ResetButton reset={onReset} />
                    ) : null}
                </>
            );
        } else {
            return (
                <DateRangeEditor
                    {...dateRangeItem.editorOptions}
                    validators={dateRangeItem.validators}
                    value={dateRangeItem.value}
                    resetValue={dateRangeItem.resetValue}
                    type={dateRangeItem.type}
                    ref={ref}
                    editorTemplateName={dateRangeItem.editorTemplateName}
                    fontColorStyle="filterItem"
                    validateValueBeforeChange={true}
                    fontWeight={dateRangeItem.editorOptions?.fontWeight || fontWeight}
                    onTextValueChanged={props.textValueHandler}
                    onRangeChanged={props.dateRangeHandler}
                    customEvents={['onTextValueChanged', 'onRangeChanged']}
                />
            );
        }
    }
    return null;
});

function ContentTemplate(props: IFilterViewProps): React.ReactElement {
    if (
        props.resetButtonVisibility === 'hidden' ||
        (props.resetButtonVisibility === 'withoutTextValue' &&
            (props.filterText ||
                props.allChangedFilterTextValueInvisible ||
                !props.isAllFastReseted))
    ) {
        return (
            <div className="controls-FilterView__wrapper">
                <DateRangeItem
                    dateRangeItem={props.dateRangeItem}
                    needShowDetailPanelTarget={props.needShowDetailPanelTarget}
                    emptyText={props.emptyText}
                    detailPanelTemplateName={props.detailPanelTemplateName}
                    source={props.source}
                    needShowFastFilter={props.needShowFastFilter}
                    openPanel={props.openPanel}
                    resetFrequentItem={props.resetFrequentItem}
                    itemTemplate={props.itemTemplate}
                    theme={props.theme}
                    alignmentClass={props.alignmentClass}
                    readOnly={props.readOnly}
                    textValueHandler={props.textValueHandler}
                    dateRangeHandler={props.dateRangeHandler}
                />
                <PrimaryFrequentFilter
                    source={props.source}
                    configs={props.configs}
                    displayText={props.displayText}
                    openPanel={props.openPanel}
                    resetFrequentItem={props.resetFrequentItem}
                    primaryFilter={props.primaryFilter}
                    itemTemplate={props.itemTemplate}
                    readOnly={props.readOnly}
                    theme={props.theme}
                    alignmentClass={props.alignmentClass}
                />
                <FrequentFilter
                    needShowFastFilter={props.needShowFastFilter}
                    source={props.source}
                    configs={props.configs}
                    displayText={props.displayText}
                    openPanel={props.openPanel}
                    resetFrequentItem={props.resetFrequentItem}
                    detailPanelTemplateName={props.detailPanelTemplateName}
                    emptyText={props.emptyText}
                    isFastReseted={props.isFastReseted}
                    isFiltersReseted={props.isFiltersReseted}
                    itemTemplate={props.itemTemplate}
                    readOnly={props.readOnly}
                    theme={props.theme}
                    alignmentClass={props.alignmentClass}
                />
                <FilterButtonText
                    openDetailPanel={props.openDetailPanel}
                    itemTemplate={props.itemTemplate}
                    filterText={props.filterText}
                    readOnly={props.readOnly}
                    theme={props.theme}
                    alignmentClass={props.alignmentClass}
                    needShowResetCross={props.needShowResetCross}
                    resetFilterText={props.resetFilterText}
                />
                <DetailPanelTarget
                    itemTemplate={props.itemTemplate}
                    openDetailPanel={props.openDetailPanel}
                    needShowDetailPanelTarget={props.needShowDetailPanelTarget}
                    detailPanelTemplateName={props.detailPanelTemplateName}
                    readOnly={props.readOnly}
                    theme={props.theme}
                    emptyText={props.emptyText}
                    alignment={props.alignment}
                />
            </div>
        );
    } else {
        return (
            <Button
                caption={rk('Сбросить')}
                viewMode="link"
                fontColorStyle="label"
                fontSize="m"
                onClick={props.resetFilter}
                data-qa="FilterView__Reset"
            />
        );
    }
}

const forwardedComponent = React.forwardRef(function FilterViewReact(
    props: IFilterViewProps,
    ref: React.ForwardedRef<unknown>
): React.ReactElement {
    const designContext = React.useContext(DesignContext);
    const wasabyContext = React.useContext(getWasabyContext());
    const readOnly = useReadonly(props);

    const highlightedOnFocus = React.useMemo(() => {
        return wasabyContext?.workByKeyboard && !readOnly;
    }, [wasabyContext, readOnly]);

    const alignment = React.useMemo(() => {
        if (props.setAlignment) {
            props.setAlignment(designContext?.alignment || props.alignment);
        }
        return designContext?.alignment || props.alignment;
    }, [props.alignment, designContext]);

    const openDetailPanel = React.useCallback(() => {
        props.openDetailPanel();
    }, [props.openDetailPanel]);

    const isButtonVisible =
        (props.needShowDetailPanelTarget && (!props.emptyText || props.detailPanelTemplateName)) ||
        !props.showFilterText;
    const alignmentClass = props.detailPanelTemplateName
        ? 'controls-FilterView-' + alignment + '__block'
        : '';
    return (
        <div
            ref={ref}
            {...props.attrs}
            className={`${props.attrs?.className} controls_filter_theme-${
                props.theme
            } controls-FilterView controls-FilterView-${alignment}
            controls-FilterView_${isButtonVisible ? 'withButton' : 'withoutButton'}
            ${props.readOnly ? 'controls-FilterView_readOnly' : ''}`}
            onMouseEnter={props.startLoadDependencies}
        >
            {props.showFilterText ? (
                <ContentTemplate
                    dateRangeItem={props.dateRangeItem}
                    emptyText={props.emptyText}
                    detailPanelTemplateName={props.detailPanelTemplateName}
                    source={props.source}
                    needShowFastFilter={props.needShowFastFilter}
                    openPanel={props.openPanel}
                    itemTemplate={props.itemTemplate}
                    textValueHandler={props.textValueHandler}
                    dateRangeHandler={props.dateRangeHandler}
                    configs={props.configs}
                    displayText={props.displayText}
                    resetFrequentItem={props.resetFrequentItem}
                    isFastReseted={props.isFastReseted}
                    isAllFastReseted={props.isAllFastReseted}
                    isFiltersReseted={props.isFiltersReseted}
                    openDetailPanel={props.openDetailPanel}
                    filterText={props.filterText}
                    needShowResetCross={props.needShowResetCross}
                    primaryFilter={props.primaryFilter}
                    resetFilterText={props.resetFilterText}
                    needShowDetailPanelTarget={props.needShowDetailPanelTarget}
                    theme={props.theme}
                    readOnly={props.readOnly}
                    alignmentClass={alignmentClass}
                    alignment={alignment}
                    isAdaptive={props.isAdaptive}
                    resetFilter={props.resetFilter}
                    startLoadDependencies={props.startLoadDependencies}
                    resetButtonVisibility={props.resetButtonVisibility}
                    allChangedFilterTextValueInvisible={props.allChangedFilterTextValueInvisible}
                />
            ) : null}
            {isButtonVisible ? (
                <div
                    tabIndex={0}
                    name="detailPanelTarget"
                    className={`controls-FilterView__icon controls-notFocusOnEnter ${
                        highlightedOnFocus ? 'controls-focused-item_background' : ''
                    }
                                           ${
                                               !props.resetFilterButtonCaption
                                                   ? 'controls-FilterView-button-' + alignment
                                                   : ''
                                           }
                                           controls-FilterView__icon_state_${
                                               props.readOnly ? 'disabled' : 'enabled'
                                           }
                                           icon-FilterNew`}
                    onMouseDown={openDetailPanel}
                    data-qa="FilterView__icon"
                    data-name="FilterView__icon"
                >
                    {props.isAdaptive && (props.filterText || !props.isAllFastReseted) ? (
                        <div
                            className={`controls-FilterView-buttonIndicator
                        controls-FilterView-buttonIndicator_${
                            props.showFilterText === false ? 'visible' : 'hidden'
                        }
                        `}
                        ></div>
                    ) : null}
                </div>
            ) : null}
        </div>
    );
});

/**
 * @name Controls/_filter/View#showFilterText
 * @cfg {Boolean} Флаг отображения текста рядом с кнопкой фильтра.
 */

forwardedComponent.defaultProps = {
    showFilterText: true,
};

export default forwardedComponent;
