import * as rk from 'i18n!Controls-Actions';

/**
 * Типы отчетов для построения
 * @remark Должен быть синхронизирован с Recruitment/VacancyEnquiry/opener:ReportType
 * @remark Типы отчетов по кандидатам должны быть синхронизированы с RecruitmentWidget/_textCommand/Const/CandidateEventReportType
 */
export enum ReportType {
    Responsible = 'Responsible',
    Department = 'Department',
    Location = 'Location',
    UserCategory = 'UserCategory',
    RecruitmentFunnel = 'RecruitmentFunnel',
    ActivityDynamic = 'ActivityDynamic',
    RecruitmentDynamic = 'RecruitmentDynamic',
    Sources = 'Sources',
}

/**
 * Источник данных для редактора типа отчета
 * @const
 * @private
 */
export const reportSource = [
    {
        key: ReportType.Responsible,
        title: rk('Вакансии по исполнителям'),
        rights: [
            {
                zone: 'Подбор персонала',
                requiredLevel: 'Read',
            },
        ],
    },
    {
        key: ReportType.Department,
        title: rk('Вакансии по отделам'),
        rights: [
            {
                zone: 'Подбор персонала',
                requiredLevel: 'Read',
            },
        ],
    },
    {
        key: ReportType.Location,
        title: rk('Вакансии по регионам'),
        rights: [
            {
                zone: 'Подбор персонала',
                requiredLevel: 'Read',
            },
        ],
    },
    {
        key: ReportType.UserCategory,
        title: rk('Вакансии по категориям'),
        rights: [
            {
                zone: 'Подбор персонала',
                requiredLevel: 'Read',
            },
        ],
    },
    {
        key: ReportType.RecruitmentFunnel,
        title: rk('Воронка подбора'),
        rights: [
            {
                zone: 'События по кандидатам',
                requiredLevel: 'Read',
            },
        ],
    },
    {
        key: ReportType.ActivityDynamic,
        title: rk('Динамика активности'),
        rights: [
            {
                zone: 'События по кандидатам',
                requiredLevel: 'Read',
            },
        ],
    },
    {
        key: ReportType.RecruitmentDynamic,
        title: rk('Динамика работы с кандидатами'),
        rights: [
            {
                zone: 'События по кандидатам',
                requiredLevel: 'Read',
            },
        ],
    },
    {
        key: ReportType.Sources,
        title: rk('Источники по кандидатам'),
        rights: [
            {
                zone: 'Кандидаты на работу',
                requiredLevel: 'Read',
            },
        ],
    },
];
