export const getRandomSPO = (min:number, max: number) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const getRandomBPM = (min:number, max: number) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.random() * (max - min + 1) + min;
}


export const generateStatus = (isNormal: boolean) => {
    return isNormal ? "normal": "anormal"
}
