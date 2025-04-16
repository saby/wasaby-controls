import { getTodayRange } from 'Controls-Lists/_timelineGrid/render/GoToTodayButton';

describe('GoTodayButton', () => {
    // Мокаем текущую дату
    const mockToday = new Date('2025-04-16T14:30:00'); // Сегодня 16 апреля 2025, 14:30
    const mockDate = jest.spyOn(global, 'Date').mockImplementation(() => mockToday);

    const customRanges = [
        {
            start: 10,
            end: 12,
        },
        {
            start: 14,
            end: 15,
        },
        {
            start: 19,
            end: 21,
        },
    ];

    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterAll(() => {
        mockDate.mockRestore();
    });

    describe('getTodayRange with hasCustomRanges', () => {
        it('should scroll to current time when custom ranges are not defined and quantum is hour', () => {
            const currentRange = {
                start: new Date('2025-04-01T00:00:00'),
                end: new Date('2025-04-01T23:00:00'),
            };
            // Подготовка
            jest.spyOn(Date.prototype, 'getHours').mockReturnValue(14); // Текущий час 14:00

            // Вызов функции
            const result = getTodayRange(currentRange, undefined, mockToday, undefined);

            // Проверки
            expect(result.start).toEqual(new Date('2025-04-16T14:00:00')); // Начало: сегодня, 14:00
            expect(result.end).toEqual(new Date('2025-04-17T13:00:00')); // Конец: завтра, 13:00
        });

        it('should not scroll to current time when сustom ranges defined and quantum is hour', () => {
            const currentRange = {
                start: new Date('2025-04-01T10:00:00'),
                end: new Date('2025-04-01T19:00:00'),
            };

            // Вызов функции
            const result = getTodayRange(currentRange, undefined, mockToday, customRanges);

            // Проверки
            expect(result.start).toEqual(new Date('2025-04-16T10:00:00')); // Начало: сегодня, 10:00
            expect(result.end).toEqual(new Date('2025-04-17T10:00:00')); // Конец: завтра, 10:00
        });

        it('should handle non-hour quantum correctly with defined custom ranges', () => {
            const currentRange = {
                start: new Date('2025-04-01T00:00:00'),
                end: new Date('2025-04-02T03:00:00'),
            };

            // Вызов функции
            const result = getTodayRange(currentRange, undefined, mockToday, customRanges);

            // Проверки
            expect(result.start).toEqual(new Date('2025-04-16T00:00:00')); // Начало: сегодня
            expect(result.end).toEqual(new Date('2025-04-19T00:00:00')); // Конец: через 3 дня
        });
    });
});
