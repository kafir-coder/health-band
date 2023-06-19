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

export const objectToEqualization = (object1 = {}) => {

	let result = ""
    let counter = 1
	for (const [key, value] of Object.entries(object1)) {

        if (counter === Object.values(object1).length) {
            result += `${key} = '${value}' `
        } else {
            result += `${key} = '${value}', `
        }

        counter+=1
	}
	return result
}
