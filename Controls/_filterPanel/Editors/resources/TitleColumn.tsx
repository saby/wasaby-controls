import Async from 'Controls/Container/Async';
import { TemplateFunction } from 'UI/Base';
import { IColumnTemplateProps } from 'Controls/grid';
import { GridRow } from 'Controls/grid';
import { loadSync } from 'WasabyLoader/ModulesLoader';

interface ITitleColumnProps {
    getTextValueForStickyItem: Function;
    getTextValueForItem: Function;
    titleTemplate?: TemplateFunction;
    titleTemplateName?: string;
    markerStyle?: string;
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
    return (
        <div
            title={tplProps.getTextValueForItem(
                props.item.contents,
                props.column.config.displayProperty
            )}
            className={`controls-ListEditor__columns ${
                tplProps.markerStyle !== 'primary' ? 'controls-background-master' : ''
            }
                 ${getFontWeightClass(props.item, tplProps.markerStyle)}
                 ${props.column.getTextOverflowClasses?.()}`}
        >
            <div className="controls-FilterEditors__list-item-title ws-ellipsis">
                {tplProps.titleTemplate || tplProps.titleTemplateName
                    ? getTitleTemplate(props, tplProps)
                    : tplProps.getTextValueForItem(
                          props.item.contents,
                          props.column.config.displayProperty
                      )}
            </div>
        </div>
    );
}
