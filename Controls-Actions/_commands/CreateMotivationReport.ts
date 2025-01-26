/**
 * Действие создания отчета мотивации
 * @author Ефимов К.А.
 * @public
 */

export default class CreateMotivationReport {
    async execute({ reportType }: object): Promise<void> {
        const { openReport } = await import('Motivation/Reports/create');
        return openReport(reportType);
    }
}
