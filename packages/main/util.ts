function getUuiD(randomLength:number){
    return Number(Math.random().toString().substring(2,2+randomLength) + Date.now()).toString(36)
}

function flatten(obj: any){
    const res = {}
    for(let key in obj){
        // @ts-ignore
        res[key] = obj[key]
    }
    return res
}

export {getUuiD, flatten}