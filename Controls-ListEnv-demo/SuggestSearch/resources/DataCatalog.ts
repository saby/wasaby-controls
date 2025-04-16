import { resourceRoot } from 'Core/constants';

const departments = [
    {
        id: 1,
        department: 'Разработка',
        owner: 'Новиков Д.В.',
        title: 'Разработка'
    },
    {
        id: 2,
        department: 'Продвижение СБИС',
        owner: 'Кошелев А.Е.',
        title: 'Продвижение СБИС'
    },
    {
        id: 3,
        department: 'Федеральная клиентская служка',
        owner: 'Мануйлова Ю.А.',
        title: 'Федеральная клиентская служка'
    },
    {
        id: 4,
        department: 'Служба эксплуатации',
        owner: 'Субботин А.В.',
        title: 'Служба эксплуатации'
    },
    {
        id: 5,
        department: 'Технологии и маркетинг',
        owner: 'Чеперегин А.С.',
        title: 'Технологии и маркетинг'
    },
    {
        id: 6,
        department: 'Федеральный центр продаж. Call-центр Ярославль',
        owner: 'Кошелев А.Е.',
        title: 'Федеральный центр продаж. Call-центр Ярославль'
    },
    {
        id: 7,
        department: 'Сопровождение информационных систем',
        owner: 'Кошелев А.Е.',
        title: 'Сопровождение информационных систем'
    }
];

const companies = [
    {
        id: 8,
        title: 'Наша компания',
        city: null,
        description: 'Управленческая структура',
        active: true
    },
    {
        id: 9,
        title: 'Все юридические лица',
        city: null,
        description: null,
        active: true
    },
    {
        id: 10,
        title: 'Инори, ООО',
        city: 'г. Ярославль',
        description: null,
        active: true
    },
    {
        id: 11,
        title: '"Компания "Тензор" ООО',
        city: 'г. Ярославль',
        description: null,
        active: true
    },
    {
        id: 12,
        title: 'Ромашка, ООО',
        city: 'г. Москва',
        description: null,
        active: false
    },
    {
        id: 13,
        title: 'Сбербанк-Финанс, ООО',
        city: 'г. Пермь',
        description: null,
        active: true
    },
    {
        id: 14,
        title: 'Петросоюз-Континент, ООО',
        city: 'г. Самара',
        description: null,
        active: false
    },
    {
        id: 15,
        title: 'Альфа Директ сервис, ОАО',
        city: 'г. Москва',
        description: null,
        active: true
    },
    {
        id: 16,
        title: 'АК "ТРАНСНЕФТЬ", ОАО',
        city: 'г. Москва',
        description: null,
        active: false
    },
    {
        id: 17,
        title: 'Иванова Зинаида Михайловна, ИП',
        city: 'г. Яросалвль',
        description: null,
        active: true
    }
];

const LONG_DATA_AMOUNT = 100;
const IDENT_DATA_AMOUNT = 13;

const _companies = companies;
const _departments = departments;
const _departmentsDataLong = _departments.concat(getLongData());
const _departmentsWithCompanies = _companies.concat(_departmentsDataLong);
const _departmentsWithImges = departments;
const _departmentsDev = _departments.concat(getIdentData());
const _treeData = [
    {
        id: 1,
        parent: null,
        'parent@': true,
        code: null,
        price: null,
        title: 'SATA',
    },
    {
        id: 11,
        parent: 1,
        'parent@': null,
        code: 'ST1000NC001',
        price: 2800,
        title: 'Жесткий диск Seagate Original SATA-III 1Tb ST1000NC001 Constellation СS (7200rpm) 64Mb 3.5',
    },
    {
        id: 12,
        parent: 1,
        'parent@': null,
        code: 'ST1100DX001',
        price: 3750,
        title: 'Жесткий диск Seagate Original SATA-III 2Tb ST2000DX001 Desktop SкомплSHD (7200rpm) 64Mb 3.5',
    },
    {
        id: 2,
        parent: null,
        'parent@': true,
        code: null,
        price: null,
        title: 'Canon',
    },
    {
        id: 21,
        parent: 2,
        'parent@': null,
        code: 'FR-11434',
        price: 49500,
        title: 'Canon EOS 7D Body SATA support',
    },
    {
        id: 22,
        parent: 2,
        'parent@': null,
        code: 'FR-11434',
        price: 49500,
        title: 'Canon 6D Body',
    },
    {
        id: 3,
        parent: null,
        'parent@': null,
        code: 'FT-13352',
        price: 112360,
        title: 'Canon EOS 5D Mark II Body SATA support',
    },
];

const _translitDepartments = [
    {
        id: 0,
        department: 'Hfphf,jnrf',
        owner: 'Новиков Д.В.',
        title: 'Hfphf,jnrf',
    },
    {
        id: 1,
        department: 'Разработка Hfphf,jnrf',
        owner: 'Новиков Д.В.',
        title: 'Разработка Hfphf,jnrf',
    },
];

_departmentsWithImges.forEach((department) => {
    department.photo = resourceRoot + 'Controls-ListEnv-demo/SuggestSearch/resources/Novikov.png';
});

_departmentsDataLong.forEach((department) => {
    department.currentTab = 1;
});

_companies.forEach((companie) => {
    companie.currentTab = 2;
});

function getLongData(): object[] {
    const data = [];

    for (let id = 10; id < LONG_DATA_AMOUNT; id++) {
        data.push({
            id,
            department: 'Разработка',
            owner: 'Новиков Д.В.',
            title: 'Разработка',
        });
    }
    data.push({
        id: 211,
        department: 'Очень длинное название отдела очень длинное название отдела Разработка',
        owner: 'Новиков Д.В.',
        title: 'Очень длинное название отдела очень длинное название отдела Разработка',
    });
    return data;
}

function getIdentData(): object[] {
    const data = [];

    for (let id = 10; id < IDENT_DATA_AMOUNT; id++) {
        data.push({
            id,
            department: 'Разработка',
            owner: 'Новиков Д.В.',
            title: 'Разработка' + id,
        });
    }
    return data;
}

export {
    _companies,
    _departments,
    _departmentsWithCompanies,
    _departmentsDataLong,
    _departmentsWithImges,
    _departmentsDev,
    _treeData,
    _translitDepartments,
};
