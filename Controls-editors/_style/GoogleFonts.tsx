// Подключение гугл шрифтов, как временное решение
const GOOGLE_FONTS =
    "@import url('https://fonts.googleapis.com/css2?family=Oswald:wght@200..700&display=swap');" +
    "@import url('https://fonts.googleapis.com/css2?family=PT+Serif:ital,wght@0,400;0,700;1,400;1,700&display=swap');" +
    "@import url('https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap');" +
    "@import url('https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap');" +
    "@import url('https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap');" +
    "@import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap');";

interface IGoogleFontsProps {
    disable?: boolean;
}

export function GoogleFonts({ disable = false }: IGoogleFontsProps): JSX.Element {
    const fonts = disable ? '' : GOOGLE_FONTS;
    return <style>{fonts}</style>;
}
