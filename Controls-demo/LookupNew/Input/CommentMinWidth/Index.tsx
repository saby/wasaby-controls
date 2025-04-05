import * as React from 'react';
import { Input } from 'Controls/lookup';
import { Memory } from 'Types/source';
import * as MemorySourceFilter from 'Controls-demo/Utils/MemorySourceFilter';
import { COMPANIES } from 'Controls-demo/LookupNew/resources/DataStorage';

function Index(props, ref) {
    const [value, setValue] = React.useState();
    const [selectedKeys, setSelectedKeys] = React.useState(['Наша компания']);

    const source = new Memory({
        data: COMPANIES,
        keyProperty: 'id',
        filter: MemorySourceFilter(),
    });
    const selectorTemplate = {
        templateName: 'Controls-demo/LookupNew/Input/SelectorTemplate/resources/SelectorTemplate',
        templateOptions: {
            headingCaption: 'Выберите организацию',
        },
        popupOptions: {
            width: 500,
            height: 500,
        },
    };
    const valueChangeHandler = React.useCallback((value) => setValue(value), [props]);
    const selectedKeysChangedHandler = React.useCallback(
        (keys) => {
            setSelectedKeys(keys);
        },
        [props]
    );
    return (
        <div
            ref={ref}
            className="controlsDemo__mb1 controlsDemo__wrapper__horizontal controlsDemo__cell"
        >
            <div className="controls-text-label">
                Минимальная ширина области ввода комментария равна количеству символов в подсказке,
            </div>
            <div className="controls-text-label">
                но не более 25% ширины поля, если подсказка оказалась длиннее.
            </div>
            <Input
                className="Controls-demo_LookupNew_Input_Comment__with-comment  controlsDemo_fixedWidth300"
                value={value}
                source={source}
                displayProperty="title"
                keyProperty="id"
                searchParam="title"
                comment="comment"
                commentVisibility="always"
                selectorTemplate={selectorTemplate}
                selectedKeys={selectedKeys}
                onValueChanged={valueChangeHandler}
                onSelectedKeysChanged={selectedKeysChangedHandler}
            />
        </div>
    );
}

export default React.forwardRef(Index);
