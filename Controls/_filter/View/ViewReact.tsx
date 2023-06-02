import * as rk from 'i18n!Controls';
import * as React from 'react';
import { Button } from 'Controls/buttons';
import DateRangeEditor from 'Controls/_filter/Editors/DateRange';
import { IFilterViewOptions } from './interface/IFilterView';
import { IFilterItemConfigs } from '../View';
import { IFilterItem } from './interface/IFilterItem';

export interface IFilterViewProps extends IFilterViewOptions {
    displayText: string;
    configs: IFilterItemConfigs;
    filterText?: string;

    alignmentClass: string;
    needShowFastFilter: boolean;
    needShowDetailPanelTarget: boolean;
    hasResetValues: boolean;
    allChangedFilterTextValueInvisible: boolean;
    isFastReseted: boolean;

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

const DetailPanelTarget = function getDetailPanelTarget(
    props: IFilterViewProps
): React.ReactElement {
    if (props.needShowDetailPanelTarget && props.emptyText && !props.detailPanelTemplateName) {
        return (
            <props.itemTemplate
                name="emptyTextTarget"
                itemName="emptyTextTarget"
                readOnly={props.readOnly}
                theme={props.theme}
                text={props.emptyText}
                title={props.emptyText}
                attrs={{
                    className: `controls-FilterView__emptyText
                              ${'controls-FilterView-' + props.alignment + '__block'}`,
                }}
                onMouseDown={(event) => {
                    props.openDetailPanel(event, 'emptyTextTarget');
                }}
            />
        );
    }
    return null;
};

const ResetButton = React.forwardRef((props: { reset: Function }, ref) => {
    return (
        <span
            ref={ref}
            className="controls-FilterView__iconReset icon-CloseNew"
            attrs={{
                'ws-no-focus': true,
            }}
            onMouseDown={props.reset}
            title={rk('Сбросить')}
            data-qa="FilterView__iconReset"
        ></span>
    );
});

const FilterButtonText = function getFilterButtonText(props: IFilterViewProps): React.ReactElement {
    if (props.filterText) {
        return (
            <>
                <props.itemTemplate
                    readOnly={props.readOnly}
                    theme={props.theme}
                    text={props.filterText}
                    title={props.filterText}
                    onMouseDown={props.openDetailPanel}
                    attrs={{
                        className: `controls-FilterView__filterTextLine ${props.alignmentClass}`,
                    }}
                />
                {props.hasResetValues && !props.readOnly ? (
                    <ResetButton reset={props.resetFilterText} />
                ) : null}
            </>
        );
    }
    return null;
};
const FrequentFilter = function getFrequentFilter(props: IFilterViewProps): React.ReactElement {
    if (props.needShowFastFilter) {
        const itemTemplate = (itemConfig) => {
            return (
                <>
                    <props.itemTemplate
                        readOnly={props.readOnly}
                        theme={props.theme}
                        text={props.displayText[itemConfig.name].text}
                        title={props.displayText[itemConfig.name].title}
                        moreText={props.displayText[itemConfig.name].hasMoreText}
                        onMouseDown={(event) => {
                            props.openPanel(event, itemConfig.name);
                        }}
                        name={itemConfig.name}
                        item={itemConfig}
                        itemName={itemConfig.name}
                        attrs={{
                            className: `controls-FilterView__frequentFilter ${props.alignmentClass}`,
                        }}
                    />
                    {itemConfig.hasOwnProperty('resetValue') && !props.readOnly ? (
                        <ResetButton
                            reset={(event) => {
                                props.resetFrequentItem(event, itemConfig);
                            }}
                        />
                    ) : null}
                </>
            );
        };
        const itemsTemplates = [];
        props.source.forEach((item, index) => {
            if (
                (props.configs[item.name] &&
                    props.configs[item.name].items &&
                    props.configs[item.name].items.getCount() &&
                    props.displayText[item.name].text !== undefined) ||
                props.displayText[item.name]?.text
            ) {
                itemsTemplates.push(itemTemplate(item));
            }
        });

        return (
            <>
                {props.detailPanelTemplateName &&
                ((props.emptyText && props.emptyText !== rk('Все') && props.isFastReseted) ||
                    props.isFiltersReseted) ? (
                    <props.itemTemplate
                        name="all_frequent"
                        itemName="all_frequent"
                        readOnly={props.readOnly}
                        theme={props.theme}
                        text={props.emptyText || rk('Все')}
                        attrs={{
                            className: `controls-FilterView__frequentFilter ${props.alignmentClass}`,
                        }}
                        onMouseDown={(event) => {
                            props.openPanel(event, 'all_frequent');
                        }}
                    />
                ) : null}
                {itemsTemplates}
            </>
        );
    }
    return null;
};

const ContentTemplate = React.forwardRef((props: IFilterViewProps) => {
    const defaultFontWeight =
        props.needShowDetailPanelTarget && (!props.emptyText || props.detailPanelTemplateName)
            ? 'default'
            : undefined;
    if (
        props.resetButtonVisibility === 'hidden' ||
        (props.resetButtonVisibility === 'withoutTextValue' &&
            (props.filterText || props.allChangedFilterTextValueInvisible || !props.isFastReseted))
    ) {
        return (
            <div className="controls-FilterView__wrapper">
                {props.dateRangeItem && props.dateRangeItem.viewMode !== 'extended' ? (
                    <DateRangeEditor
                        {...props.dateRangeItem.editorOptions}
                        validators={props.dateRangeItem.validators}
                        value={props.dateRangeItem.value}
                        resetValue={props.dateRangeItem.resetValue}
                        type={props.dateRangeItem.type}
                        editorTemplateName={props.dateRangeItem.editorTemplateName}
                        fontColorStyle="filterItem"
                        validateValueBeforeChange={true}
                        fontWeight={
                            props.dateRangeItem.editorOptions?.fontWeight || defaultFontWeight
                        }
                        onTextValueChanged={props.textValueHandler}
                        onRangeChanged={props.dateRangeHandler}
                        customEvents={['onTextValueChanged', 'onRangeChanged']}
                    />
                ) : null}
                <FrequentFilter {...props} />
                <FilterButtonText {...props} />
                <DetailPanelTarget {...props} />
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
});

export default React.forwardRef(function FilterViewReact(
    props: IFilterViewProps,
    ref: React.ForwardedRef<unknown>
): React.ReactElement {
    const isButtonVisible =
        props.needShowDetailPanelTarget && (!props.emptyText || props.detailPanelTemplateName);
    const alignmentClass = props.detailPanelTemplateName
        ? 'controls-FilterView-' + props.alignment + '__block'
        : '';
    return (
        <div
            ref={ref}
            {...props.attrs}
            className={`${props.attrs?.className} controls_filter_theme-${
                props.theme
            } controls-FilterView controls-FilterView-${props.alignment}
            controls-FilterView_${isButtonVisible ? 'withButton' : 'withoutButton'}
            ${props.readOnly ? 'controls-FilterView_readOnly' : ''}`}
            onMouseEnter={props.startLoadDependencies}
        >
            <ContentTemplate {...props} alignmentClass={alignmentClass} />
            {isButtonVisible ? (
                <div
                    name="detailPanelTarget"
                    className={`controls-FilterView__icon
                                           ${
                                               !props.resetFilterButtonCaption
                                                   ? 'controls-FilterView-button-' + props.alignment
                                                   : ''
                                           }
                                           controls-FilterView__icon_state_${
                                               props.readOnly ? 'disabled' : 'enabled'
                                           }
                                           icon-FilterNew`}
                    onMouseDown={props.openDetailPanel}
                    data-qa="FilterView__icon"
                    data-name="FilterView__icon"
                ></div>
            ) : null}
        </div>
    );
});
