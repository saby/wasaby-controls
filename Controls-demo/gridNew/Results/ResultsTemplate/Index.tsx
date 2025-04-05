import { forwardRef } from 'react';
import { Reference } from 'Router/router';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import Default from 'Controls-demo/gridNew/Results/ResultsTemplate/Default/Index';
import Unaccented from 'Controls-demo/gridNew/Results/ResultsTemplate/Unaccented/Index';
import Additional from 'Controls-demo/gridNew/Results/ResultsTemplate/Additional/Index';

function Link(props) {
    const clearProps = {
        ...props,
    };
    // на a нельзя вешать такой атрибут, будут ошибки в консоли. По-хорошему, надо править Reference, но не очень понятно как
    delete clearProps.onMouseOverCallback;
    return <a {...clearProps} />;
}

const Component = forwardRef(function (props, ref) {
    const rootClass =
        props.className +
        ' controlsDemo__wrapper controlsDemo__flexRow controlsDemo__childMinWidth400';
    return (
        <div className={rootClass} ref={ref}>
            <div className="controlsDemo__cell">
                <Reference
                    className="controls-text-label"
                    state="app/:app"
                    app="Controls-demo/gridNew/Results/ResultsTemplate/Default/Index"
                >
                    <Link>Стиль текста итогов</Link>
                </Reference>
                <Default />
            </div>
            <div className="controlsDemo__cell">
                <Reference
                    className="controls-text-label"
                    state="app/:app"
                    app="Controls-demo/gridNew/Results/ResultsTemplate/Unaccented/Index"
                >
                    <Link>Неакцентный стиль текста итогов</Link>
                </Reference>
                <Unaccented />
            </div>
            <div className="controlsDemo__cell">
                <Reference
                    className="controls-text-label"
                    state="app/:app"
                    app="Controls-demo/gridNew/Results/ResultsTemplate/Additional/Index"
                >
                    <Link>Стиль дополнительного текста итогов</Link>
                </Reference>
                <Additional />
            </div>
        </div>
    );
});

export default Component;

Component.getLoadConfig = function (): Record<string, IDataConfig<IListDataFactoryArguments>> {
    return {
        ...Default.getLoadConfig(),
        ...Unaccented.getLoadConfig(),
        ...Additional.getLoadConfig(),
    };
};
