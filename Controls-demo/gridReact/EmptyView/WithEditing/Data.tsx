import { RecordSet } from 'Types/collection';
import { EditRender } from 'Controls-demo/gridReact/EmptyView/WithEditing/CellTemplates/EditRender';

export interface IData {
    key: number;
    message?: string;
    fullName?: string;
    photo?: Images;
    date?: string;
    state?: string;
    group?: string;
}

export enum Images {
    Green = 'green',
    Red = 'red',
    Yellow = 'yellow',
    Blue = 'blue',
}

export function getHeader() {
    return [
        { caption: 'Страна' },
        { caption: 'Столица' },
        { caption: 'Население' },
        { caption: 'Площадь км2' },
        { caption: 'Плотность населения чел/км2' },
    ];
}

export function getColumns() {
    return [
        {
            key: 'country',
            editorRender: <EditRender property={'country'} />,
            width: '200px',
        },
        {
            key: 'capital',
            editorRender: <EditRender property={'capital'} />,
            width: '100px',
        },
        {
            key: 'population',
            editorRender: <EditRender property={'population'} />,
            width: '150px',
        },
        {
            key: 'square',
            editorRender: <EditRender property={'square'} />,
            width: '100px',
        },
        {
            key: 'populationDensity',
            editorRender: <EditRender property={'populationDensity'} />,
            width: '120px',
        },
    ];
}

const dataArray: any[] = [];

export function addOneToDataArray() {
    dataArray.push({
        key: 1,
        country: '',
        capital: '',
        population: '',
        square: '',
        populationDensity: '',
    });
}

export function getItems(): RecordSet {
    return new RecordSet({
        keyProperty: 'key',
        rawData: dataArray,
    });
}
