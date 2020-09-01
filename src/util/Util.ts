export function firstUpperCase(text: string): string {
    const firstChar = text.split("")[0].toUpperCase();
    return firstChar + text.slice(1);
}

export default { firstUpperCase };