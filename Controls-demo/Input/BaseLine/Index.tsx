import { forwardRef, useState, useMemo } from 'react';
import { Switch } from 'Controls/toggle';
import { Label, Text, Area } from 'Controls/input';
import { Combobox } from 'Controls/dropdown';
import { Input as SearchInput } from 'Controls/search';
import { Memory } from 'Types/source';

export default forwardRef(function BaseLine(_, ref) {
    const [readOnly, setReadOnly] = useState(false);
    const [inputValue, setInputValue] = useState('value');
    const [areaValue, setAreaValue] = useState('value\n1\n2\n3');

    const source = useMemo(() => {
        return new Memory({
            keyProperty: 'key',
            data: [
                {key: 1, title: 'Ярославль'},
                {key: 2, title: 'Москва'},
                {key: 3, title: 'Санкт-Петербург'},
            ],
        });
    }, []);
    const [selectedKey, setSelectedKey] = useState(1);

    return <div ref={ref}
                className="controls-padding_top-m controls-padding_bottom-m tw-flex ws-justify-content-center">
        <div className="tw-flex ws-flex-column ws-align-items-center" data-qa="controlsDemo_capture">
            <div data-qa="controlsDemo_Input__capture"
                 className="controls-margin_bottom-m">
                <Switch
                    caption="readonly"
                    value={readOnly}
                    onValueChanged={setReadOnly}
                    customEvents={['onValueChanged']}/>
            </div>
            <div data-qa="controlsDemo_Input__capture"
                 className="tw-flex ws-justify-content-center ws-align-items-baseline controls-margin_bottom-m">
                <Label caption="Caption" className="controls-margin_right-m"/>
                <Text
                    className="controlsDemo_fixedWidth200"
                    value={inputValue}
                    onValueChanged={setInputValue}
                    customEvents={['onValueChanged']}
                    readOnly={readOnly}/>
            </div>
            <div data-qa="controlsDemo_Input__capture"
                 className="tw-flex ws-justify-content-center ws-align-items-baseline controls-margin_bottom-m">
                <Label caption="Caption" className="controls-margin_right-m"/>
                <Area
                    className="controlsDemo_fixedWidth200"
                    value={areaValue}
                    onValueChanged={setAreaValue}
                    customEvents={['onValueChanged']}
                    readOnly={readOnly}/>
            </div>
            <div data-qa="controlsDemo_Input__capture"
                 className="tw-flex ws-justify-content-center ws-align-items-baseline controls-margin_bottom-m">
                <Label caption="Caption" className="controls-margin_right-m"/>
                <Area
                    className="controlsDemo_fixedWidth200"
                    value={areaValue}
                    minLines={3}
                    onValueChanged={setAreaValue}
                    customEvents={['onValueChanged']}
                    readOnly={readOnly}/>
            </div>
            <div data-qa="controlsDemo_Input__capture"
                 className="tw-flex ws-justify-content-center ws-align-items-baseline controls-margin_bottom-m">
                <Label caption="Caption" className="controls-margin_right-m"/>
                <Text
                    className="controlsDemo_fixedWidth100 controls-margin_right-s"
                    value="value"
                    readOnly={readOnly}
                />
                <p className="controls-margin_right-s">textarea</p>
                <Area
                    className="controlsDemo_fixedWidth100 controls-margin_right-s"
                    value={areaValue}
                    minLines={3}
                    onValueChanged={setAreaValue}
                    customEvents={['onValueChanged']}
                    readOnly={readOnly}/>
                <span className="controls-margin_right-s">combobox</span>
                <Combobox
                    source={source}
                    className="controlsDemo_fixedWidth100 controls-margin_right-s"
                    displayProperty="title"
                    keyProperty="key"
                    selectedKey={selectedKey}
                    onSelectedKey={setSelectedKey}
                    customEvents={['onSelectedKey']}
                    readOnly={readOnly}
                />
                <span className="controls-margin_right-s">search</span>
                <SearchInput/>
            </div>
        </div>
    </div>;
});