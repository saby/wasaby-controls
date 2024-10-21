export const STAFF_LIST = ['Калинина Ника', 'Яковлева Софья', 'Сидорова Алиса', 'Антонова Валерия'];

const JOBS_LIST = [
    'Инженер-программист (3 категории)',
    'Инженер-программист (3+ категории)',
    'Инженер-программист (2 категории)',
    'Инженер-программист (2+ категории)',
];

export function resolveJobByNumber(number: number): string {
    return JOBS_LIST[Number(String(number).slice(-1))];
}
