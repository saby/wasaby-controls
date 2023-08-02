import { Memory } from 'Types/source';
import { RecordSet } from 'Types/collection';
import { Model } from 'Types/entity';
import { getColumns } from './Data';

export interface TItem {
    key: string | number;
    country: string;
    capital: string;
}

export function getData(): TItem[] {
    return [
        {
            key: 0,
            country: 'Afghanistan',
            capital: 'Kabul',
        },
        {
            key: 1,
            country: 'Albania',
            capital: 'Tirana (Tirane)',
        },
        {
            key: 2,
            country: 'Algeria',
            capital: 'Algiers',
        },
        {
            key: 3,
            country: 'Andorra',
            capital: 'Andorra la Vella',
        },
        {
            key: 4,
            country: 'Angola',
            capital: 'Luanda',
        },
        {
            key: 5,
            country: 'Antigua and Barbuda',
            capital: "Saint John's",
        },
        {
            key: 6,
            country: 'Argentina',
            capital: 'Buenos Aires',
        },
        {
            key: 7,
            country: 'Armenia',
            capital: 'Yerevan',
        },
        {
            key: 8,
            country: 'Australia',
            capital: 'Canberra',
        },
        {
            key: 9,
            country: 'Austria',
            capital: 'Vienna',
        },
        {
            key: 10,
            country: 'Azerbaijan',
            capital: 'Baku',
        },
        {
            key: 11,
            country: 'Bahamas',
            capital: 'Nassau',
        },
        {
            key: 12,
            country: 'Bahrain',
            capital: 'Manama',
        },
        {
            key: 13,
            country: 'Bangladesh',
            capital: 'Dhaka',
        },
        {
            key: 14,
            country: 'Barbados',
            capital: 'Bridgetown',
        },
        {
            key: 15,
            country: 'Belarus',
            capital: 'Minsk',
        },
        {
            key: 16,
            country: 'Belgium',
            capital: 'Brussels',
        },
        {
            key: 17,
            country: 'Belize',
            capital: 'Belmopan',
        },
        {
            key: 18,
            country: 'Benin',
            capital: 'Porto Novo',
        },
        {
            key: 19,
            country: 'Bhutan',
            capital: 'Thimphu',
        },
        {
            key: 20,
            country: 'Bolivia',
            capital: 'La Paz (administrative), Sucre (official)',
        },
        {
            key: 21,
            country: 'Bosnia and Herzegovina',
            capital: 'Sarajevo',
        },
        {
            key: 22,
            country: 'Botswana',
            capital: 'Gaborone',
        },
        {
            key: 23,
            country: 'Brazil',
            capital: 'Brasilia',
        },
        {
            key: 24,
            country: 'Brunei',
            capital: 'Bandar Seri Begawan',
        },
        {
            key: 25,
            country: 'Bulgaria',
            capital: 'Sofia',
        },
        {
            key: 26,
            country: 'Burkina Faso',
            capital: 'Ouagadougou',
        },
        {
            key: 27,
            country: 'Burundi',
            capital: 'Gitega',
        },
        {
            key: 28,
            country: 'Cambodia',
            capital: 'Phnom Penh',
        },
        {
            key: 29,
            country: 'Cameroon',
            capital: 'Yaounde',
        },
        {
            key: 30,
            country: 'Canada',
            capital: 'Ottawa',
        },
        {
            key: 31,
            country: 'Cape Verde',
            capital: 'Praia',
        },
        {
            key: 32,
            country: 'Central African Republic',
            capital: 'Bangui',
        },
        {
            key: 33,
            country: 'Chad',
            capital: "N'Djamena",
        },
        {
            key: 34,
            country: 'Chile',
            capital: 'Santiago',
        },
        {
            key: 35,
            country: 'China',
            capital: 'Beijing',
        },
        {
            key: 36,
            country: 'Colombia',
            capital: 'Bogota',
        },
        {
            key: 37,
            country: 'Comoros',
            capital: 'Moroni',
        },
        {
            key: 38,
            country: 'Congo, Democratic Republic of the',
            capital: 'Kinshasa',
        },
        {
            key: 39,
            country: 'Congo, Republic of the',
            capital: 'Brazzaville',
        },
        {
            key: 40,
            country: 'Costa Rica',
            capital: 'San Jose',
        },
        {
            key: 41,
            country: "Côte d'Ivoire (Ivory Coast)",
            capital: 'Yamoussoukro',
        },
        {
            key: 42,
            country: 'Croatia',
            capital: 'Zagreb',
        },
        {
            key: 43,
            country: 'Cuba',
            capital: 'Havana',
        },
        {
            key: 44,
            country: 'Cyprus',
            capital: 'Nicosia',
        },
        {
            key: 45,
            country: 'Czech Republic (Czechia)',
            capital: 'Prague',
        },
        {
            key: 46,
            country: 'Denmark',
            capital: 'Copenhagen',
        },
        {
            key: 47,
            country: 'Djibouti',
            capital: 'Djibouti',
        },
        {
            key: 48,
            country: 'Dominica',
            capital: 'Roseau',
        },
        {
            key: 49,
            country: 'Dominican Republic',
            capital: 'Santo Domingo',
        },
        {
            key: 50,
            country: 'East Timor',
            capital: 'Dili',
        },
        {
            key: 51,
            country: 'Ecuador',
            capital: 'Quito',
        },
        {
            key: 52,
            country: 'Egypt',
            capital: 'Cairo',
        },
        {
            key: 53,
            country: 'El Salvador',
            capital: 'San Salvador',
        },
        {
            key: 54,
            country: 'England',
            capital: 'London',
        },
        {
            key: 55,
            country: 'Equatorial Guinea',
            capital: 'Malabo',
        },
        {
            key: 56,
            country: 'Eritrea',
            capital: 'Asmara',
        },
        {
            key: 57,
            country: 'Estonia',
            capital: 'Tallinn',
        },
        {
            key: 58,
            country: 'Eswatini (Swaziland)',
            capital: 'Mbabana',
        },
        {
            key: 59,
            country: 'Ethiopia',
            capital: 'Addis Ababa',
        },
        {
            key: 60,
            country: 'Federated States of Micronesia',
            capital: 'Palikir',
        },
        {
            key: 61,
            country: 'Fiji',
            capital: 'Suva',
        },
        {
            key: 62,
            country: 'Finland',
            capital: 'Helsinki',
        },
        {
            key: 63,
            country: 'France',
            capital: 'Paris',
        },
        {
            key: 64,
            country: 'Gabon',
            capital: 'Libreville',
        },
        {
            key: 65,
            country: 'Gambia',
            capital: 'Banjul',
        },
        {
            key: 66,
            country: 'Georgia',
            capital: 'Tbilisi',
        },
        {
            key: 67,
            country: 'Germany',
            capital: 'Berlin',
        },
        {
            key: 68,
            country: 'Ghana',
            capital: 'Accra',
        },
        {
            key: 69,
            country: 'Greece',
            capital: 'Athens',
        },
        {
            key: 70,
            country: 'Grenada',
            capital: "Saint George's",
        },
        {
            key: 71,
            country: 'Guatemala',
            capital: 'Guatemala City',
        },
        {
            key: 72,
            country: 'Guinea',
            capital: 'Conakry',
        },
        {
            key: 73,
            country: 'Guinea-Bissau',
            capital: 'Bissau',
        },
        {
            key: 74,
            country: 'Guyana',
            capital: 'Georgetown',
        },
        {
            key: 75,
            country: 'Haiti',
            capital: 'Port au Prince',
        },
        {
            key: 76,
            country: 'Honduras',
            capital: 'Tegucigalpa',
        },
        {
            key: 77,
            country: 'Hungary',
            capital: 'Budapest',
        },
        {
            key: 78,
            country: 'Iceland',
            capital: 'Reykjavik',
        },
        {
            key: 79,
            country: 'India',
            capital: 'New Delhi',
        },
        {
            key: 80,
            country: 'Indonesia',
            capital: 'Jakarta',
        },
        {
            key: 81,
            country: 'Iran',
            capital: 'Tehran',
        },
        {
            key: 82,
            country: 'Iraq',
            capital: 'Baghdad',
        },
        {
            key: 83,
            country: 'Ireland',
            capital: 'Dublin',
        },
        {
            key: 84,
            country: 'Israel',
            capital: 'Jerusalem (very limited international recognition)',
        },
        {
            key: 85,
            country: 'Italy',
            capital: 'Rome',
        },
        {
            key: 86,
            country: 'Jamaica',
            capital: 'Kingston',
        },
        {
            key: 87,
            country: 'Japan',
            capital: 'Tokyo',
        },
        {
            key: 88,
            country: 'Jordan',
            capital: 'Amman',
        },
        {
            key: 89,
            country: 'Kazakhstan',
            capital: 'Astana',
        },
        {
            key: 90,
            country: 'Kenya',
            capital: 'Nairobi',
        },
        {
            key: 91,
            country: 'Kiribati',
            capital: 'Tarawa Atoll',
        },
        {
            key: 92,
            country: 'Kosovo',
            capital: 'Pristina',
        },
        {
            key: 93,
            country: 'Kuwait',
            capital: 'Kuwait City',
        },
        {
            key: 94,
            country: 'Kyrgyzstan',
            capital: 'Bishkek',
        },
        {
            key: 95,
            country: 'Laos',
            capital: 'Vientiane',
        },
        {
            key: 96,
            country: 'Latvia',
            capital: 'Riga',
        },
        {
            key: 97,
            country: 'Lebanon',
            capital: 'Beirut',
        },
        {
            key: 98,
            country: 'Lesotho',
            capital: 'Maseru',
        },
        {
            key: 99,
            country: 'Liberia',
            capital: 'Monrovia',
        },
        {
            key: 100,
            country: 'Libya',
            capital: 'Tripoli',
        },
        {
            key: 101,
            country: 'Liechtenstein',
            capital: 'Vaduz',
        },
        {
            key: 102,
            country: 'Lithuania',
            capital: 'Vilnius',
        },
        {
            key: 103,
            country: 'Luxembourg',
            capital: 'Luxembourg',
        },
        {
            key: 104,
            country: 'Madagascar',
            capital: 'Antananarivo',
        },
        {
            key: 105,
            country: 'Malawi',
            capital: 'Lilongwe',
        },
        {
            key: 106,
            country: 'Malaysia',
            capital: 'Kuala Lumpur',
        },
        {
            key: 107,
            country: 'Maldives',
            capital: 'Male',
        },
        {
            key: 108,
            country: 'Mali',
            capital: 'Bamako',
        },
        {
            key: 109,
            country: 'Malta',
            capital: 'Valletta',
        },
        {
            key: 110,
            country: 'Marshall Islands',
            capital: 'Majuro',
        },
        {
            key: 111,
            country: 'Mauritania',
            capital: 'Nouakchott',
        },
        {
            key: 112,
            country: 'Mauritius',
            capital: 'Port Louis',
        },
        {
            key: 113,
            country: 'Mexico',
            capital: 'Mexico City',
        },
        {
            key: 114,
            country: 'Moldova',
            capital: 'Chisinau',
        },
        {
            key: 115,
            country: 'Monaco',
            capital: 'Monaco',
        },
        {
            key: 116,
            country: 'Mongolia',
            capital: 'Ulaanbaatar',
        },
        {
            key: 117,
            country: 'Montenegro',
            capital: 'Podgorica',
        },
        {
            key: 118,
            country: 'Morocco',
            capital: 'Rabat',
        },
        {
            key: 119,
            country: 'Mozambique',
            capital: 'Maputo',
        },
        {
            key: 120,
            country: 'Myanmar (Burma)',
            capital: 'Nay Pyi Taw',
        },
        {
            key: 121,
            country: 'Namibia',
            capital: 'Windhoek',
        },
        {
            key: 122,
            country: 'Nauru',
            capital: 'No official capital',
        },
        {
            key: 123,
            country: 'Nepal',
            capital: 'Kathmandu',
        },
        {
            key: 124,
            country: 'Netherlands',
            capital: 'Amsterdam',
        },
        {
            key: 125,
            country: 'New Zealand',
            capital: 'Wellington',
        },
        {
            key: 126,
            country: 'Nicaragua',
            capital: 'Managua',
        },
        {
            key: 127,
            country: 'Niger',
            capital: 'Niamey',
        },
        {
            key: 128,
            country: 'Nigeria',
            capital: 'Abuja',
        },
        {
            key: 129,
            country: 'North Korea',
            capital: 'Pyongyang',
        },
        {
            key: 130,
            country: 'North Macedonia (Macedonia)',
            capital: 'Skopje',
        },
        {
            key: 131,
            country: 'Northern Ireland',
            capital: 'Belfast',
        },
        {
            key: 132,
            country: 'Norway',
            capital: 'Oslo',
        },
        {
            key: 133,
            country: 'Oman',
            capital: 'Muscat',
        },
        {
            key: 134,
            country: 'Pakistan',
            capital: 'Islamabad',
        },
        {
            key: 135,
            country: 'Palau',
            capital: 'Melekeok',
        },
        {
            key: 136,
            country: 'Palestine',
            capital: 'Jerusalem (very limited international recognition)',
        },
        {
            key: 137,
            country: 'Panama',
            capital: 'Panama City',
        },
        {
            key: 138,
            country: 'Papua New Guinea',
            capital: 'Port Moresby',
        },
        {
            key: 139,
            country: 'Paraguay',
            capital: 'Asuncion',
        },
        {
            key: 140,
            country: 'Peru',
            capital: 'Lima',
        },
        {
            key: 141,
            country: 'Philippines',
            capital: 'Manila',
        },
        {
            key: 142,
            country: 'Poland',
            capital: 'Warsaw',
        },
        {
            key: 143,
            country: 'Portugal',
            capital: 'Lisbon',
        },
        {
            key: 144,
            country: 'Qatar',
            capital: 'Doha',
        },
        {
            key: 145,
            country: 'Romania',
            capital: 'Bucharest',
        },
        {
            key: 146,
            country: 'Russia',
            capital: 'Moscow',
        },
        {
            key: 147,
            country: 'Rwanda',
            capital: 'Kigali',
        },
        {
            key: 148,
            country: 'Saint Kitts and Nevis',
            capital: 'Basseterre',
        },
        {
            key: 149,
            country: 'Saint Lucia',
            capital: 'Castries',
        },
        {
            key: 150,
            country: 'Saint Vincent and the Grenadines',
            capital: 'Kingstown',
        },
        {
            key: 151,
            country: 'Samoa',
            capital: 'Apia',
        },
        {
            key: 152,
            country: 'San Marino',
            capital: 'San Marino',
        },
        {
            key: 153,
            country: 'Sao Tome and Principe',
            capital: 'Sao Tome',
        },
        {
            key: 154,
            country: 'Saudi Arabia',
            capital: 'Riyadh',
        },
        {
            key: 155,
            country: 'Scotland',
            capital: 'Edinburgh',
        },
        {
            key: 156,
            country: 'Senegal',
            capital: 'Dakar',
        },
        {
            key: 157,
            country: 'Serbia',
            capital: 'Belgrade',
        },
        {
            key: 158,
            country: 'Seychelles',
            capital: 'Victoria',
        },
        {
            key: 159,
            country: 'Sierra Leone',
            capital: 'Freetown',
        },
        {
            key: 160,
            country: 'Singapore',
            capital: 'Singapore',
        },
        {
            key: 161,
            country: 'Slovakia',
            capital: 'Bratislava',
        },
        {
            key: 162,
            country: 'Slovenia',
            capital: 'Ljubljana',
        },
        {
            key: 163,
            country: 'Solomon Islands',
            capital: 'Honiara',
        },
        {
            key: 164,
            country: 'Somalia',
            capital: 'Mogadishu',
        },
        {
            key: 165,
            country: 'South Africa',
            capital: 'Pretoria, Bloemfontein, Cape Town',
        },
        {
            key: 166,
            country: 'South Korea',
            capital: 'Seoul',
        },
        {
            key: 167,
            country: 'South Sudan',
            capital: 'Juba',
        },
        {
            key: 168,
            country: 'Spain',
            capital: 'Madrid',
        },
        {
            key: 169,
            country: 'Sri Lanka',
            capital: 'Sri Jayawardenapura Kotte',
        },
        {
            key: 170,
            country: 'Sudan',
            capital: 'Khartoum',
        },
        {
            key: 171,
            country: 'Suriname',
            capital: 'Paramaribo',
        },
        {
            key: 172,
            country: 'Sweden',
            capital: 'Stockholm',
        },
        {
            key: 173,
            country: 'Switzerland',
            capital: 'Bern',
        },
        {
            key: 174,
            country: 'Syria',
            capital: 'Damascus',
        },
        {
            key: 175,
            country: 'Taiwan',
            capital: 'Taipei',
        },
        {
            key: 176,
            country: 'Tajikistan',
            capital: 'Dushanbe',
        },
        {
            key: 177,
            country: 'Tanzania',
            capital: 'Dodoma',
        },
        {
            key: 178,
            country: 'Thailand',
            capital: 'Bangkok',
        },
        {
            key: 179,
            country: 'Togo',
            capital: 'Lome',
        },
        {
            key: 180,
            country: 'Tonga',
            capital: "Nuku'alofa",
        },
        {
            key: 181,
            country: 'Trinidad and Tobago',
            capital: 'Port of Spain',
        },
        {
            key: 182,
            country: 'Tunisia',
            capital: 'Tunis',
        },
        {
            key: 183,
            country: 'Türkiye (Turkey)',
            capital: 'Ankara',
        },
        {
            key: 184,
            country: 'Turkmenistan',
            capital: 'Ashgabat',
        },
        {
            key: 185,
            country: 'Tuvalu',
            capital: 'Funafuti',
        },
        {
            key: 186,
            country: 'Uganda',
            capital: 'Kampala',
        },
        {
            key: 187,
            country: 'Ukraine',
            capital: 'Kyiv or Kiev',
        },
        {
            key: 188,
            country: 'United Arab Emirates',
            capital: 'Abu Dhabi',
        },
        {
            key: 189,
            country: 'United Kingdom',
            capital: 'London',
        },
        {
            key: 190,
            country: 'United States',
            capital: 'Washington D.C.',
        },
        {
            key: 191,
            country: 'Uruguay',
            capital: 'Montevideo',
        },
        {
            key: 192,
            country: 'Uzbekistan',
            capital: 'Tashkent',
        },
        {
            key: 193,
            country: 'Vanuatu',
            capital: 'Port Vila',
        },
        {
            key: 194,
            country: 'Vatican City',
            capital: 'Vatican City',
        },
        {
            key: 195,
            country: 'Venezuela',
            capital: 'Caracas',
        },
        {
            key: 196,
            country: 'Vietnam',
            capital: 'Hanoi',
        },
        {
            key: 197,
            country: 'Wales',
            capital: 'Cardiff',
        },
        {
            key: 198,
            country: 'Yemen',
            capital: "Sana'a",
        },
        {
            key: 199,
            country: 'Zambia',
            capital: 'Lusaka',
        },
        {
            key: 200,
            country: 'Zimbabwe',
            capital: 'Harare',
        },
    ];
}

function getMetaData(): Record<string, unknown> {
    return {
        results: new Model({
            rawData: {
                count: 200,
                populationCountries: 7888000001,
                populationCapitals: 1442563023,
            },
        }),
    };
}

export function getSource(): Memory {
    return new Memory({
        keyProperty: 'key',
        data: getData(),
    });
}

export function getItems(): RecordSet {
    return new RecordSet({
        keyProperty: 'key',
        rawData: getData(),
        metaData: getMetaData(),
    });
}

export { getColumns };
