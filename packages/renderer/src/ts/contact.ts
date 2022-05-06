import {FileBox} from "file-box";

interface ConcatSerialize {
    id:string;
    name:string;
    alias:string;
    gender?:string;
    avatar?: string;
    [propName: string]: any;
}

class Contact {
    id:string;
    name:string;
    alias:string;
    gender?:string;
    avatar?: string;
    tags = []
    constructor(options:ConcatSerialize) {
        this.id=options.id
        this.name=options.name
        this.alias=options.alias
        this.avatar = options.avatar
    }
}

export {Contact}