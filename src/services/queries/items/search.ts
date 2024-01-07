export const searchItems = async (term: string, size: number = 5) => {
    const cleaned = term
    .replaceAll(/[^a-zA-Z ]/g, '')
    .trim()
    .split(' ')
    .map(word => word ? `%${word}%` : '')
    .join(" ")
};
