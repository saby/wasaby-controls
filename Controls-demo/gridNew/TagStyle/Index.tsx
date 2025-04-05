import { forwardRef } from 'react';
import { Reference } from 'Router/router';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import TagStyleFromCellData from 'Controls-demo/gridNew/TagStyle/TagStyleFromCellData/Index';
import TagStyleFromTemplateParam from 'Controls-demo/gridNew/TagStyle/TagStyleFromTemplateParam/Index';
import TagClick from 'Controls-demo/gridNew/TagStyle/TagClick/Index';
import TagHover from 'Controls-demo/gridNew/TagStyle/TagHover/Index';
import TagStyleFromCellDataIndex from 'Controls-demo/gridNew/TagStyle/TagStyleFromCellData/Index';
import TagStyleFromTemplateParamIndex from 'Controls-demo/gridNew/TagStyle/TagStyleFromTemplateParam/Index';
import TagClickIndex from 'Controls-demo/gridNew/TagStyle/TagClick/Index';
import TagHoverIndex from 'Controls-demo/gridNew/TagStyle/TagHover/Index';

function Link(props) {
    const clearProps = {
        ...props,
    };
    // на a нельзя вешать такой атрибут, будут ошибки в консоли. По-хорошему, надо править Reference, но не очень понятно как
    delete clearProps.onMouseOverCallback;
    return <a {...clearProps} />;
}

const Component = forwardRef(function (props, ref) {
    const rootClass = props.className + ' controlsDemo__wrapper controlsDemo__flexRow';
    return (
        <div className={rootClass} ref={ref}>
            <div className="controlsDemo__cell">
                <Reference
                    className="controls-text-label"
                    state="app/:app"
                    app="Controls-demo/gridNew/TagStyle/TagStyleFromCellData/Index"
                >
                    <Link>Из данных в ячейке (tagStyleProperty)</Link>
                </Reference>
                <TagStyleFromCellDataIndex />
            </div>

            <div className="controlsDemo__cell">
                <Reference
                    className="controls-text-label"
                    state="app/:app"
                    app="Controls-demo/gridNew/TagStyle/TagStyleFromTemplateParam/Index"
                >
                    <Link>Из параметра шаблона для колонки (tagStyle)</Link>
                </Reference>
                <TagStyleFromTemplateParamIndex />
            </div>

            <div className="controlsDemo__cell">
                <Reference
                    className="controls-text-label"
                    state="app/:app"
                    app="Controls-demo/gridNew/TagStyle/TagClick/Index"
                >
                    <Link>Обработка события tagClick</Link>
                </Reference>
                <TagClickIndex />
            </div>

            <div className="controlsDemo__cell">
                <Reference
                    className="controls-text-label"
                    state="app/:app"
                    app={'Controls-demo/gridNew/TagStyle/TagHover/Index'}
                >
                    <Link>Обработка события tagHover</Link>
                </Reference>
                <TagHoverIndex />
            </div>
        </div>
    );
});

export default Component;

Component.getLoadConfig = function (): Record<string, IDataConfig<IListDataFactoryArguments>> {
    return {
        ...TagStyleFromCellData.getLoadConfig(),
        ...TagStyleFromTemplateParam.getLoadConfig(),
        ...TagClick.getLoadConfig(),
        ...TagHover.getLoadConfig(),
    };
};
