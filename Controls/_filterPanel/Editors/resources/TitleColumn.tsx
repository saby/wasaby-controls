import Async from 'Controls/Container/Async';
import { TemplateFunction } from 'UI/Base';
import { IColumnTemplateProps, EditArrowComponent } from 'Controls/grid';
import AdditionalColumnTemplate from './AdditionalColumnTemplate';
import { GridRow } from 'Controls/grid';
import { loadSync } from 'WasabyLoader/ModulesLoader';

interface ITitleColumnProps {
    getTextValueForStickyItem: Function;
    getTextValueForItem: Function;
    titleTemplate?: TemplateFunction;
    titleTemplateName?: string;
    markerStyle?: string;
    contrastBackground?: boolean;
    showEditArrow?: boolean;
    editArrowVisibilityCallback?: Function;
    isStickyItemSticked?: boolean;
    textValue?: string;
}

function getTitleTemplate(props: IColumnTemplateProps, tplProps: ITitleColumnProps): JSX.Element {
    if (tplProps.titleTemplate) {
        if (tplProps.titleTemplate.charAt) {
            const LoadedTemplate = loadSync(tplProps.titleTemplate);
            return <LoadedTemplate {...props} />;
        }
        return <tplProps.titleTemplate {...props} />;
    } else {
        return <Async templateName={tplProps.titleTemplateName} templateOptions={props} />;
    }
}

function getFontWeightClass(item: GridRow, markerStyle: string): string {
    if (item.contents.get('pinned') || item.isSelected()) {
        return 'controls-fontweight-bold';
    } else if (markerStyle !== 'primary') {
        return 'controls-fontweight-normal';
    }
}

/**
 * Шаблон колонки с текстом.
 * @private
 */
export default function TitleColumn(props: IColumnTemplateProps): JSX.Element {
    const tplProps = props.column.getTemplateOptions() as unknown as ITitleColumnProps;
    const isItemSticked = props.item.isSticked() && tplProps.isStickyItemSticked;
    let editArrowVisible = false;
    let textValue = '';
    if (tplProps.showEditArrow) {
        editArrowVisible = true;
        if (tplProps.editArrowVisibilityCallback) {
            editArrowVisible = tplProps.editArrowVisibilityCallback(props.item.contents);
        }
    }

    if (isItemSticked) {
        textValue = tplProps.textValue;
    } else {
        textValue = props.item.contents.get(props.column.config.displayProperty);
    }

    return (
        <div
            title={textValue}
            className={`controls-ListEditor__columns ${
                tplProps.markerStyle !== 'primary' && tplProps.contrastBackground !== false
                    ? 'controls-background-master'
                    : ''
            }
                ws-flexbox ws-align-items-baseline controls-FilterEditors__list-item-wrapper
                 ${getFontWeightClass(props.item, tplProps.markerStyle)}`}
        >
            <div
                className="ws-flexbox ws-align-items-center
             controls-FilterEditors__list-item-title"
            >
                {(tplProps.titleTemplate || tplProps.titleTemplateName) && !isItemSticked ? (
                    getTitleTemplate(props, tplProps)
                ) : (
                    <div
                        className={`ws-ellipsis ${
                            editArrowVisible ? 'controls-Grid__editArrow-overflow-ellipsis' : ''
                        }`}
                    >
                        {textValue}
                    </div>
                )}
                {editArrowVisible ? (
                    <EditArrowComponent
                        textOverflow={'ellipsis'}
                        backgroundStyle={tplProps.backgroundColorStyle}
                        onClick={tplProps.handleEditArrowClick}
                    />
                ) : null}
            </div>
            <AdditionalColumnTemplate column={props.column} item={props.item} />
        </div>
    );
}
