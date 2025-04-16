import 'css!Controls-Graphs-editors/DataSetFieldSeriesDesignTimeEditor';
import * as translate from 'i18n!Controls-Graphs-editors';
import { DataSetBindingFacade } from 'Frame/base';
import { useBindingFacade } from 'FrameEditor/dataContextSelector';
import { useOpenWidgetSettings } from 'FrameEditor/controls';

interface IDataSetFieldSeriesDesignTimeEditorProps {
    className?: string;
    value: {
        getStaticProperties: () => {
            name: string[];
            fields: {}[];
            series: {}[];
            ['.style']?: {
                reference?: string;
            };
            headingVisible?: boolean;
        };
    };
}

export default function DataSetFieldSeriesDesignTimeEditor(
    props: IDataSetFieldSeriesDesignTimeEditorProps
) {
    const { open, isOpened } = useOpenWidgetSettings();
    const staticProperties = props.value.getStaticProperties();
    const [bindingFacade] = useBindingFacade<DataSetBindingFacade>(staticProperties.name);
    const fields = bindingFacade?.getFields();
    const series = bindingFacade?.getAggregate();
    let className = 'controls-Graphs-editors__dataSetFieldSeriesDesignTimeEditor';
    if (props.className) {
        className += ` ${props.className}`;
    }
    if (staticProperties?.['.style']?.reference) {
        className += ` ${staticProperties?.['.style']?.reference}`;
    }
    const dataSetListOpenHandler = () => {
        if (!isOpened()) {
            open();
        }
    };
    if (!bindingFacade) {
        return (
            <div className={className}>
                {staticProperties.headingVisible !== false ? (
                    <div className="controls-Graphs-editors__dataSetFieldSeriesDesignTimeEditor_headerPlace"></div>
                ) : null}
                <div className="controls-Graphs-editors__dataSetFieldSeriesDesignTimeEditor_graphPlace">
                    <div className="controls-Graphs-editors__dataSetFieldSeriesDesignTimeEditor_textContent">
                        <span
                            onClick={dataSetListOpenHandler}
                            onTouchStart={dataSetListOpenHandler}
                            className="controls-Graphs-editors__dataSetFieldSeriesDesignTimeEditor_linkText"
                        >
                            {translate('Выбрать данные')}
                        </span>
                        , {translate('чтобы отобразить график')}
                    </div>
                </div>
            </div>
        );
    } else if (!fields?.length || !series?.length) {
        return (
            <div className={className}>
                {staticProperties.headingVisible !== false ? (
                    <div className="controls-Graphs-editors__dataSetFieldSeriesDesignTimeEditor_headerPlace"></div>
                ) : null}
                <div className="controls-Graphs-editors__dataSetFieldSeriesDesignTimeEditor_graphPlace">
                    <div className="controls-Graphs-editors__dataSetFieldSeriesDesignTimeEditor_textContent">
                        <span
                            onClick={dataSetListOpenHandler}
                            onTouchStart={dataSetListOpenHandler}
                            className="controls-Graphs-editors__dataSetFieldSeriesDesignTimeEditor_linkText"
                        >
                            {translate('Настройте показатели и измерения')}
                        </span>
                        , {translate('чтобы отобразить график')}
                    </div>
                </div>
            </div>
        );
    }

    return null;
}
