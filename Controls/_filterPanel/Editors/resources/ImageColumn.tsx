import { TemplateFunction } from 'UI/Base';
import Async from 'Controls/Container/Async';
import { IColumnTemplateProps } from 'Controls/grid';
import TitleColumn from './TitleColumn';
import { loadSync } from 'WasabyLoader/ModulesLoader';

interface IImageColumnProps extends IColumnTemplateProps {
    getTextValueForStickyItem: Function;
    getTextValueForItem: Function;
    imageTemplate?: TemplateFunction;
    imageTemplateName?: string;
    markerStyle?: string;
}

function ImageTemplate(props: IImageColumnProps): JSX.Element {
    const tplProps =
        props.column.getTemplateOptions() as unknown as IImageColumnProps;
    const imageProperty = props.column.config.imageProperty;
    if (tplProps.imageTemplateName) {
        return (
            <Async
                templateName={tplProps.imageTemplateName}
                templateOptions={props}
            />
        );
    } else if (tplProps.imageTemplate) {
        if (tplProps.imageTemplate.charAt) {
            const CustomImageTemplate = loadSync(tplProps.imageTemplate);
            return <CustomImageTemplate {...props} />;
        }
        return <tplProps.imageTemplate {...props} />;
    } else if (props.item.contents.get(imageProperty)) {
        return (
            <img
                className="controls-ListEditor__column-img"
                src={props.item.contents.get(imageProperty)}
            />
        );
    }
    return null;
}

export default function ImageColumn(props: IImageColumnProps): JSX.Element {
    if (props.column.getTemplateOptions().emptyKey === props.item.key) {
        return <TitleColumn {...props} />;
    } else {
        return <ImageTemplate {...props} />;
    }
}
