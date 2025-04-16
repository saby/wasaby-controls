import { IMAGE_ASHI, IMAGE_BL } from './Images';

export interface IData {
    key: string | number;
    type: boolean;
    parent: string | number;
    image: string;
    caption: string;
    description?: string;
}

export const getMasterData = () => {
    return [
        {
            key: 'in_root-1',
            type: true,
            parent: null,
            image: IMAGE_ASHI,
            caption: 'Основное меню',
        },
        {
            key: 'in_root-2',
            type: true,
            parent: null,
            image: '',
            caption: 'Торты',
        },
        {
            key: 'in_root-3',
            type: true,
            parent: null,
            image: IMAGE_BL,
            caption: 'Коктейльная карта',
        },
    ];
};

export const getData = () => {
    return [
        ...getMasterData(),
        {
            key: 'in_root-1-1',
            type: true,
            parent: 'in_root-1',
            caption: 'A la carte с 12:00',
            image: '',
        },
        {
            key: 'in_root-1-11',
            type: true,
            parent: 'in_root-1',
            caption: 'В стол',
            image: '',
        },
        {
            key: 'in_root-1-1101',
            type: null,
            parent: 'in_root-1-11',
            image: '',
            caption: 'Аши из морского гребешка и тунца',
            description: '',
        },
        {
            key: 'in_root-1-1102',
            type: null,
            parent: 'in_root-1-11',
            image: '',
            caption: 'Аши из морского гребешка и тунца',
            description: '',
        },
        {
            key: 'in_root-1-12',
            type: true,
            parent: 'in_root-1',
            image: '',
            caption: 'Салаты',
        },
        {
            key: 'in_root-1-1201',
            type: null,
            parent: 'in_root-1-12',
            image: '',
            caption: 'Малагский салат с дорадо гриль',
            description: '',
        },
        {
            key: 'in_root-1-1202',
            type: null,
            parent: 'in_root-1-12',
            image: '',
            caption: 'Малагский салат с дорадо гриль',
            description: '',
        },
        {
            key: 'in_root-1-2',
            type: true,
            parent: 'in_root-1',
            image: '',
            caption: 'Бизнес-ланч ежедневно с 12:00 до 16:00 кроме выходных',
        },
        {
            key: 'in_root-1-21',
            type: null,
            parent: 'in_root-2',
            image: '',
            caption: 'Бинито-ланч',
            description: '',
        },
        {
            key: 'in_root-1-3',
            type: true,
            parent: 'in_root-1',
            image: '',
            caption: 'Завтраки с 09:00 до 12:00',
        },
        {
            key: 'in_root-2-1',
            type: true,
            parent: 'in_root-2',
            image: '',
            caption: 'Салаты',
        },
        {
            key: 'in_root-2-11',
            type: null,
            parent: 'in_root-2-1',
            image: '',
            caption: 'Аши из морского гребешка и тунца',
            description: '',
        },
    ];
};
