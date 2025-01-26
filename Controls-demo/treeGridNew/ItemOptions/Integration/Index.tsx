import * as React from 'react';
import 'Controls/gridReact';
import { View as TreeGridView } from 'Controls/treeGrid';
import { TInternalProps } from 'UICore/Executor';
import { HierarchicalMemory } from 'Types/source';
import { IDataConfig } from 'Controls-DataEnv/dataFactory';
import { IListDataFactoryArguments } from 'Controls/dataFactory';
import { ControlPanel } from './ControlPanel/ControlPanel';
import { TBackgroundStyle } from 'Controls-demo/treeGridNew/ItemOptions/Integration/ControlPanel/ControlledParams/GetCellPropsControl';
import ChangableWidthCell from 'Controls-demo/treeGridNew/ItemOptions/Integration/CellRender/ChangableWidthCell';
import { TSize } from 'Controls/interface';
import Model from 'Types/_entity/Model';
import { ICellProps } from 'Controls/gridReact';

export interface IRoundAngles {
    roundAngleTR: TSize;
    roundAngleTL: TSize;
    roundAngleBR: TSize;
    roundAngleBL: TSize;
}

function getData() {
    return [
        {
            key: 0,
            number: 1,
            country: 'Россия',
            population: 143420300,
            parent: null,
            'Раздел@': true,
            hasChild: true,
        },
        {
            key: 1,
            number: 2,
            country: 'Канада',
            population: 32805000,
            parent: null,
            'Раздел@': true,
            hasChild: true,
        },
        {
            key: 2,
            number: 3,
            country: 'Соединенные Штаты Америки',
            population: 295734100,
            parent: 7,
            'Раздел@': true,
            hasChild: true,
        },
        {
            key: 3,
            number: 4,
            country: 'Китай',
            population: 1306313800,
            parent: null,
            'Раздел@': true,
            hasChild: true,
        },
        {
            key: 4,
            number: 5,
            country: 'Бразилия',
            population: 186112800,
            parent: null,
            'Раздел@': true,
            hasChild: true,
        },
        {
            key: 5,
            number: 6,
            country: 'Австралия',
            population: 20090400,
            parent: null,
            'Раздел@': true,
            hasChild: true,
        },
        {
            key: 6,
            number: 7,
            country: 'Индия',
            population: 1080264400,
            parent: null,
            'Раздел@': true,
            hasChild: true,
        },
        {
            key: 7,
            number: 8,
            country: 'Аргентина',
            population: 39537900,
            parent: null,
            'Раздел@': true,
            hasChild: true,
        },
        {
            key: 12,
            country: 'Перемещаемый узел',
            parent: null,
            'Раздел@': null,
            hasChild: false,
        },
    ];
}

function Demo(props: TInternalProps, ref: React.ForwardedRef<HTMLDivElement>) {
    const params = new URLSearchParams(window?.location?.search);

    const [firstColumnWidth, setFirstColumnWidth] = React.useState(
        Number(params.get('firstColumnWidth')) || 200
    );
    const [roundAngle, setRoundAngle] = React.useState<IRoundAngles>({
        roundAngleTR: params.get('roundAngleTR') || 'null',
        roundAngleTL: params.get('roundAngleTL') || 'null',
        roundAngleBR: params.get('roundAngleBR') || 'null',
        roundAngleBL: params.get('roundAngleBL') || 'null',
    });
    const [borderVisibility, setBorderVisibility] = React.useState(
        params.get('borderVisibility') || 'hidden'
    );
    const [backgroundColor, setBackgroundColor] = React.useState<TBackgroundStyle>(
        (params.get('backgroundColor') as TBackgroundStyle) || 'default'
    );
    const [tagClassName, setTagClassName] = React.useState<string>(
        params.get('tagClassName') || ''
    );
    const [isControlPanelVisible, setControlPanelVisible] = React.useState(
        params.get('isControlPanelVisible') === 'true'
    );

    const updateURLParams = () => {
        const updatedParams = new URLSearchParams();
        updatedParams.set('firstColumnWidth', firstColumnWidth.toString());
        updatedParams.set('roundAngleTR', roundAngle.roundAngleTR);
        updatedParams.set('roundAngleTL', roundAngle.roundAngleTL);
        updatedParams.set('roundAngleBR', roundAngle.roundAngleBR);
        updatedParams.set('roundAngleBL', roundAngle.roundAngleBL);
        updatedParams.set('borderVisibility', borderVisibility);
        updatedParams.set('backgroundColor', backgroundColor);
        updatedParams.set('tagClassName', tagClassName);
        updatedParams.set('isControlPanelVisible', String(isControlPanelVisible));

        window.history.replaceState(
            {},
            '',
            `${window.location.pathname}?${updatedParams.toString()}`
        );
    };

    React.useEffect(() => {
        updateURLParams();
    }, [
        firstColumnWidth,
        roundAngle,
        borderVisibility,
        backgroundColor,
        tagClassName,
        isControlPanelVisible,
    ]);

    const columns = [
        {
            render: <ChangableWidthCell />,
            width: `${firstColumnWidth}px`,
            key: 'country',
            displayProperty: 'country',
            getCellProps: (props): ICellProps => ({
                backgroundColorStyle: backgroundColor,
                tagStyle: props.get('key') === 12 ? 'success' : '',
                tagClassName,
            }),
        },
        {
            width: '100px',
            key: 'key',
            displayProperty: 'key',
            getCellProps: () => ({
                backgroundColorStyle: backgroundColor,
            }),
        },
    ];

    const headers = [
        {
            width: `${firstColumnWidth}px`,
            key: 'countryHeader',
            caption: 'Страна',
        },
        {
            width: '100px',
            key: 'key',
            caption: 'Ключ',
        },
    ];

    const getRowProps = (item: Model) => {
        return {
            borderVisibility,
            roundAngleTR: roundAngle.roundAngleTR,
            roundAngleTL: roundAngle.roundAngleTL,
            roundAngleBL: roundAngle.roundAngleBL,
            roundAngleBR: roundAngle.roundAngleBR,
        };
    };

    return (
        <div
            ref={ref}
            style={{ display: 'flex', height: '100%' }}
            data-qa="controlsDemo_gridReact_ItemOptionsContainer"
        >
            <div className={'controlsDemo__wrapper'} style={{ flexGrow: 1 }}>
                {!isControlPanelVisible ? (
                    <button
                        onClick={() => setControlPanelVisible(true)}
                        style={{ marginBottom: '30px' }}
                    >
                        Показать настройки
                    </button>
                ) : (
                    <button
                        onClick={() => setControlPanelVisible(false)}
                        style={{ marginBottom: '30px' }}
                    >
                        Скрыть настройки
                    </button>
                )}

                <TreeGridView
                    storeId="GridOptionsController"
                    columns={columns}
                    header={headers}
                    getRowProps={getRowProps}
                    rowSeparatorSize="s"
                />
            </div>

            {isControlPanelVisible && (
                <ControlPanel
                    tagClassName={tagClassName}
                    setTagClassName={setTagClassName}
                    borderVisibility={borderVisibility}
                    setBorderVisibility={setBorderVisibility}
                    roundAngle={roundAngle}
                    setRoundAngle={setRoundAngle}
                    columnWidth={firstColumnWidth}
                    onColumnWidthChange={setFirstColumnWidth}
                    backgroundColor={backgroundColor}
                    onBackgroundColorChange={setBackgroundColor}
                    data-qa="controlsDemo_gridReact_ItemOptionsPanel"
                />
            )}
        </div>
    );
}

export default Object.assign(React.forwardRef(Demo), {
    getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            GridOptionsController: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    source: new HierarchicalMemory({
                        keyProperty: 'key',
                        data: getData(),
                    }),
                    expandedItems: [0, 1, 2, 3, 7],
                    displayProperty: 'title',
                    parentProperty: 'parent',
                    nodeProperty: 'Раздел@',
                },
            },
        };
    },
});
