/**
 * Опции исполнения команды
 * @private
 */
interface IExecuteOptions {
    /**
     * Имя команды для исполнения, должно быть идентично RecruitmentWidget/textFactoryCommand/Types#TCommanName
     */
    commandName:
        | 'uploadResume'
        | 'createCandidate'
        | 'createVacancy'
        | 'openReport'
        | 'createEvent';
    /**
     * Значения propTypes и commandOptions
     */
    [key: string]: unknown;
}

/**
 * Исполняет команды подбора персонала в текстовом виджете
 * @remark
 * 1. uploadResume - Загружает файл резюме с устройства пользователя,
 *    после успешной загрузки пользователь появляется в реестре по пути Побор персонала/Кандидаты.
 *
 * 2. createCandidate - Начинает создание кандидата для подбора персонала,
 *    после заполнения необходимых полей и сохранении кандидат будет добавлен в реестр по пути Подбор персонала/Кандидаты
 *
 * 3. createEvent - Начинает создание события подбора персонала определенного типа в карточке кандидата,
 *    кандидат выбирается при исполнении команды
 *
 * 4. createReport - Создает отчет по подбору персонала определенного типа
 *
 * 5. createVacancy - Начинает процесс создания вакансии для подбора персонала и открывает карточку создания вакансии,
 *    после заполнения необходимых полей и сохранения вакансия появится в реестре по пути Подбор персонала/Вакансии
 *
 * Действия можно найти по пути RecruitmentWidget/textFactoryCommand:commands
 * @author Эккерт Д.Р.
 * @public
 */
export default class RecruitmentCommand {
    async execute(options: IExecuteOptions) {
        const { commandName } = options;
        const { factory } = await import('RecruitmentWidget/textCommand');
        factory.execute(commandName, options);
    }
}
