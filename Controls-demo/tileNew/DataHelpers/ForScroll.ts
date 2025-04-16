import * as explorerImages from 'Controls-demo/Explorer/ExplorerImagesLayout';
import { CrudEntityKey } from 'Types/source';

interface IData {
    key: CrudEntityKey;
    parent: string;
    type: true | false | null;
    title: string;
    description: string;
    gradientColor: string;
    image: string;
    isShadow: boolean;
    titleLines: number;
    imagePosition: string;
    gradientStartColor?: string;
    gradientStopColor?: string;
}

function chooseRGBAColor(key: number, opacity: number = 100): string {
    const gradientVariants = ['255, 230, 230', '230, 255, 250'];
    const i = key % gradientVariants.length;
    return `rgba(${gradientVariants[i]}, ${opacity / 100})`;
}

function template(key: number, image: string, type?: true | false | null): IData {
    return {
        key,
        parent: null,
        type: type === undefined ? null : type,
        title: `Запись с ключом #${key}${image ? ' и картинкой' : ''}`,
        description: 'Шаблон 5.1 или 5.3 в зависимости от набора записей в RecordSet',
        gradientStartColor: chooseRGBAColor(key, 10),
        gradientStopColor: chooseRGBAColor(key),
        gradientColor: chooseRGBAColor(key),
        titleLines: 1,
        imagePosition: 'left',
        image,
        isShadow: true,
    };
}

// images - набор индексов записей, для которых будет проставлена картинка
export function generateData(
    count: number,
    images: number[] = [],
    type?: true | false | null
): IData[] {
    const data: IData[] = [];
    for (let index = 0; index < count; index++) {
        data.push(template(index + 1, images.includes(index) ? explorerImages[8] : null, type));
    }
    return data;
}
