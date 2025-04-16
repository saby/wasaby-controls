import * as React from 'react';
import { SuggestInputArea } from 'Controls/SuggestInputArea';
import * as MemorySourceFilter from 'Controls-demo/Utils/MemorySourceFilter';
import * as SearchMemory from 'Controls-demo/Search/SearchMemory';
import { Memory } from 'Types/source';
import { Button } from 'Controls/buttons';

export default React.forwardRef(function Index(props, ref) {
    const [value, setValue] = React.useState('');
    let generator = generateInputValue();

    const navigation = {
        source: 'page',
        view: 'page',
        sourceConfig: {
            pageSize: 2,
            page: 0,
            hasMore: false,
        },
    };

    const setInputValueHandler = React.useCallback(() => {
        const generatorValue = generator.next(value).value;
        if (generatorValue) {
            setValue(generatorValue);
        } else {
            generator = generateInputValue();
            setValue(generator.next().value);
        }
    }, [props]);

    const onValueChangedHandler = React.useCallback(
        (event, value) => {
            setValue(value);
        },
        [props]
    );

    const source: Memory = new SearchMemory({
        keyProperty: 'id',
        data: [
            {
                id: 1,
                title: 'г. Москва, ул. Линии Октябрьской Железной Дороги имени В.В.Ленина, д. 1А, стр. 14, кв. 163',
            },
            {
                id: 2,
                title: 'г. Москва, ул. Линии Октябрьской Железной Дороги имени В.В.Ленина, д. 26, корп. 4, кв. 25',
            },
            {
                id: 3,
                title: 'г. Москва, ул. Линии Октябрьской Железной Дороги имени В.В.Ленина, д. 27, корп. 4, кв. 25',
            },
        ],
        searchParam: 'title',
        filter: MemorySourceFilter(),
    });

    const suggestTemplate = React.useMemo(() => {
        return {
            templateName: 'Controls/suggestPopup:SuggestTemplate',
        };
    }, []);

    function* generateInputValue() {
        yield 'г. Москва, ул. Линии Октябрьской Железной';
        yield 'г. Москва, ул. Линии Октябрьской Железной Дороги имени В.В.Ленина, д. 2';
        return 'г. Москва, ул. Линии Октябрьской Железной Дороги имени В.В.Ленина, д. 27, корп. 4, кв. 25';
    }

    return (
        <div className="tw-h-full" ref={ref}>
            <div className="controlsDemo__wrapper tw-h-full tw-flex tw-justify-between tw-flex-col">
                <div className="controlsDemo__height200">
                    <div className="controls-text-label">
                        Многострочное поле ввода с автодополнением
                    </div>
                    <div className="tw-flex">
                        <SuggestInputArea
                            className="controlsDemo__input demo-SuggestNew__auto"
                            value={value}
                            maxLines={4}
                            displayProperty="title"
                            searchParam="title"
                            autoDropDown={true}
                            navigation={navigation}
                            source={source}
                            suggestTemplate={suggestTemplate}
                            onValueChanged={onValueChangedHandler}
                        />
                        <div className="tw-items-start">
                            <Button
                                onClick={setInputValueHandler}
                                viewMode="link"
                                caption="Заполнить текст"
                            />
                        </div>
                    </div>
                </div>
                <div className="controlsDemo__height200">
                    <div className="controls-text-label">
                        Если высота экрана не позволяет автодополнению целиком, то оно
                        позиционируется над полем
                    </div>
                    <div className="tw-flex">
                        <SuggestInputArea
                            className="controlsDemo__input demo-SuggestNew__auto"
                            value={value}
                            maxLines={4}
                            displayProperty="title"
                            searchParam="title"
                            autoDropDown={true}
                            navigation={navigation}
                            source={source}
                            suggestTemplate={suggestTemplate}
                            onValueChanged={onValueChangedHandler}
                        />

                        <div className="tw-items-start">
                            <Button
                                onClick={setInputValueHandler}
                                viewMode="link"
                                caption="Заполнить текст"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
});
