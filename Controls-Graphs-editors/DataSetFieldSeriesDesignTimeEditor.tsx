import { Button } from 'Controls/buttons';
import 'css!Controls-Graphs-editors/DataSetFieldSeriesDesignTimeEditor';
import * as translate from 'i18n!Controls-Graphs-editors';
// import { useFieldSelector } from 'FrameEditor/dataObjectFieldList';

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
    const staticProperties = props.value.getStaticProperties();
    const name = staticProperties.name;
    const fields = staticProperties.fields;
    const series = staticProperties.series;
    let className = 'controls-Graphs-editors__dataSetFieldSeriesDesignTimeEditor';
    if (props.className) {
        className += ` ${props.className}`;
    }
    if (staticProperties?.['.style']?.reference) {
        className += ` ${staticProperties?.['.style']?.reference}`;
    }
    // const fieldSelector = useFieldSelector({}, []);
    if (!name) {
        const dataSetListOpenHandler = () => {
            // fieldSelector.open();
        };
        return (
            <div className={className}>
                {staticProperties.headingVisible !== false ? (
                    <div className="controls-Graphs-editors__dataSetFieldSeriesDesignTimeEditor_headerPlace"></div>
                ) : null}
                <div className="controls-Graphs-editors__dataSetFieldSeriesDesignTimeEditor_graphPlace">
                    <div className="controls-Graphs-editors__dataSetFieldSeriesDesignTimeEditor_textContent">
                        <Button
                            caption={translate('Выбрать данные')}
                            onClick={dataSetListOpenHandler}
                            viewMode="link"
                            buttonStyle="linkButton"
                        />
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
                        <Button
                            caption={translate('Настройте показатели и измерения')}
                            viewMode="link"
                            buttonStyle="linkButton"
                        />
                        , {translate('чтобы отобразить график')}
                    </div>
                </div>
            </div>
        );
    }

    return null;
}
