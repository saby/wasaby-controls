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
    showEditArrow?: boolean;
    editArrowVisibilityCallback?: Function;
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

export default function TitleColumn(props: IColumnTemplateProps): JSX.Element {
    const tplProps = props.column.getTemplateOptions() as unknown as ITitleColumnProps;
    let editArrowVisible = false;
    if (tplProps.showEditArrow) {
        editArrowVisible = true;
        if (tplProps.editArrowVisibilityCallback) {
            editArrowVisible = tplProps.editArrowVisibilityCallback(props.item.contents);
        }
    }
    return (
        <div
            title={tplProps.getTextValueForItem(
                props.item.contents,
                props.column.config.displayProperty
            )}
            className={`controls-ListEditor__columns ${
                tplProps.markerStyle !== 'primary' ? 'controls-background-master' : ''
            }
                ws-flexbox ws-align-items-baseline ws-ellipsis controls-FilterEditors__list-item-wrapper
                 ${getFontWeightClass(props.item, tplProps.markerStyle)}`}
        >
            <div className="ws-flexbox ws-align-items-center
             controls-FilterEditors__list-item-title">
                    {tplProps.titleTemplate || tplProps.titleTemplateName
                        ? getTitleTemplate(props, tplProps)
                        : <div className={`ws-ellipsis ${editArrowVisible ? 'controls-Grid__editArrow-overflow-ellipsis' : ''}`}>
                            {tplProps.getTextValueForItem(
                              props.item.contents,
                              props.column.config.displayProperty)}
                          </div>
                    }
                {editArrowVisible ?
                    <EditArrowComponent
                        textOverflow={'ellipsis'}
                        backgroundStyle={tplProps.backgroundColorStyle}
                        onClick={tplProps.handleEditArrowClick} /> : null}
            </div>
            <AdditionalColumnTemplate {...props} />
        </div>
    );
}
