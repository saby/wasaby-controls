// data from https://lindeal.com/rating/top-14-avtomobilnykh-marok-mira-krupnejshie-transnacionalnye-avtoproizvoditeli

interface ICar {
    key: number;
    title: string;
    country?: string;
    founded: string;
    parent: number;
    type: null;
}

const makeNewCars = (
    parentKey: number,
    previousKey: number,
    carMark: string,
    series: string,
    year: string,
    amount: number
): ICar[] => {
    const result = [];

    for (let i = 1; i <= amount; i++) {
        result.push({
            key: previousKey + i,
            title: `${carMark} ${series}-${i}`,
            parent: parentKey,
            founded: year,
            type: null,
        });
    }
    return result;
};

export const Cars = {
    getData: () => {
        return [
            {
                key: 1,
                title: 'Audi',
                country: 'Германия',
                founded: '1909',
                parent: null,
                type: true,
                hasChild: true,
            },
            {
                key: 2,
                title: 'BMW',
                country: 'Германия',
                founded: '1916',
                parent: null,
                type: true,
                hasChild: true,
            },
            {
                key: 3,
                title: 'Chery',
                country: 'Китай',
                founded: '1997',
                parent: null,
                type: true,
                hasChild: true,
            },
            {
                key: 4,
                title: 'Chevrolet',
                country: 'США',
                founded: '1911',
                parent: null,
                type: true,
                hasChild: true,
            },
            {
                key: 5,
                title: 'Chrysler',
                country: 'США',
                founded: '1925',
                parent: null,
                type: true,
                hasChild: true,
            },
            {
                key: 6,
                title: 'Citroen',
                country: 'Франция',
                founded: '1919',
                parent: null,
                type: true,
                hasChild: true,
            },
            {
                key: 7,
                title: 'Ford',
                country: 'США',
                founded: '1903',
                parent: null,
                type: true,
                hasChild: true,
            },
            {
                key: 8,
                title: 'Honda',
                country: 'Япония',
                founded: '1948',
                parent: null,
                type: true,
                hasChild: true,
            },
            {
                key: 9,
                title: 'Hyundai',
                country: 'Южная Корея',
                founded: '1947',
                parent: null,
                type: true,
                hasChild: true,
            },
            {
                key: 10,
                title: 'Infinity',
                country: 'Япония',
                founded: '1989',
                parent: null,
                type: true,
                hasChild: true,
            },
            {
                key: 11,
                title: 'Jeep',
                country: 'США',
                founded: '1941',
                parent: null,
                type: true,
                hasChild: true,
            },
            {
                key: 12,
                title: 'Kia',
                country: 'Южная Корея',
                founded: '1944',
                parent: null,
                type: true,
                hasChild: true,
            },
            {
                key: 13,
                title: 'Lexus',
                country: 'Япония',
                founded: '1989',
                parent: null,
                type: true,
                hasChild: true,
            },
            {
                key: 14,
                title: 'Mazda',
                country: 'Япония',
                founded: '1920',
                parent: null,
                type: true,
                hasChild: true,
            },
            {
                key: 15,
                title: 'Mercedes-Benz',
                country: 'Германия',
                founded: '1926',
                parent: null,
                type: true,
                hasChild: true,
            },
            {
                key: 16,
                title: 'Mitsubishi',
                country: 'Япония',
                founded: '1870',
                parent: null,
                type: true,
                hasChild: true,
            },
            {
                key: 17,
                title: 'Nissan',
                country: 'Япония',
                founded: '1933',
                parent: null,
                type: true,
                hasChild: true,
            },
            {
                key: 18,
                title: 'Opel',
                country: 'Германия',
                founded: '1862',
                parent: null,
                type: true,
                hasChild: true,
            },
            {
                key: 19,
                title: 'Renault',
                country: 'Франция',
                founded: '1898',
                parent: null,
                type: true,
                hasChild: true,
            },
            {
                key: 20,
                title: 'Skoda',
                country: 'Чехия',
                founded: '1859',
                parent: null,
                type: true,
                hasChild: true,
            },
            {
                key: 21,
                title: 'Subaru',
                country: 'Япония',
                founded: '1953',
                parent: null,
                type: true,
                hasChild: true,
            },
            {
                key: 22,
                title: 'Tesla',
                country: 'США',
                founded: '2003',
                parent: null,
                type: true,
                hasChild: true,
            },
            {
                key: 23,
                title: 'Toyota',
                country: 'Япония',
                founded: '1937',
                parent: null,
                type: true,
                hasChild: true,
            },
            {
                key: 24,
                title: 'Volvo',
                country: 'Швеция',
                founded: '1927',
                parent: null,
                type: true,
                hasChild: true,
            },
            {
                key: 25,
                title: 'Volkswagen',
                country: 'Германия',
                founded: '1937',
                parent: null,
                type: true,
                hasChild: true,
            },

            /* Audi children*/
            {
                key: 101,
                title: 'Audi A',
                founded: '1994',
                parent: 1,
                type: true,
                hasChild: true,
            },
            {
                key: 102,
                title: 'Audi Q2',
                founded: '2016',
                parent: 1,
                type: null,
            },
            {
                key: 103,
                title: 'Audi Q3',
                founded: '2011',
                parent: 1,
                type: null,
            },
            {
                key: 104,
                title: 'Audi Q5',
                founded: '2008',
                parent: 1,
                type: null,
            },
            {
                key: 105,
                title: 'Audi Q7',
                founded: '2006',
                parent: 1,
                type: null,
            },
            {
                key: 106,
                title: 'Audi Q8',
                founded: '2018',
                parent: 1,
                type: null,
            },
            {
                key: 107,
                title: 'Audi TT',
                founded: '1998',
                parent: 1,
                type: null,
            },
            /* Audi A children */
            {
                key: 1001,
                title: 'Старые',
                founded: 'До 2000',
                parent: 101,
                type: true,
                hasChild: true,
            },
            {
                key: 1002,
                title: 'Новые',
                founded: 'После 2000',
                parent: 101,
                type: true,
                hasChild: true,
            },
            /** Before 2000 */
            {
                key: 2001,
                title: 'Audi A3',
                founded: '1996',
                parent: 1001,
                type: null,
            },
            {
                key: 2002,
                title: 'Audi A4',
                founded: '1995',
                parent: 1001,
                type: null,
            },
            {
                key: 2003,
                title: 'Audi A6',
                founded: '1994',
                parent: 1001,
                type: null,
            },
            {
                key: 2004,
                title: 'Audi A8',
                founded: '1994',
                parent: 1001,
                type: null,
            },
            ...makeNewCars(1001, 2004, 'Audi', 'A', '1900', 100),
            /** After 2000 */
            {
                key: 3005,
                title: 'Audi A1',
                founded: '2010',
                parent: 1002,
                type: null,
            },
            {
                key: 3006,
                title: 'Audi A5',
                founded: '2007',
                parent: 1002,
                type: null,
            },
            {
                key: 3007,
                title: 'Audi A7',
                founded: '2010',
                parent: 1002,
                type: null,
            },
            ...makeNewCars(1002, 3007, 'Audi', 'A', '2001', 100),
        ];
    },
    getHeader: () => {
        return [
            {
                caption: 'Наименование',
            },
            {
                caption: 'Дата основания',
            },
            {
                caption: 'Страна производитель',
            },
        ];
    },
    getColumns: () => {
        return [
            {
                displayProperty: 'title',
                width: '',
            },
            {
                displayProperty: 'founded',
                width: '',
            },
            {
                displayProperty: 'country',
                width: '',
            },
        ];
    },
};
