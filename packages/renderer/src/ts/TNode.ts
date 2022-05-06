import {Node} from "butterfly-dag"
import TaskCard from "../common/TaskCard.vue"
import "../assets/css/tnode.less"


interface TnodeOptions {
    id: string
    top: number
    left: number
}

class TNode extends Node{
    id: string
    top: number
    left: number
    options: object
    constructor(opts: TnodeOptions) {
        super(opts);
        this.id = opts.id;
        this.top = opts.top;
        this.left = opts.left;
        this.options = opts;
    }
    draw = (opts: any) => {

        let container = document.createElement('div')
        container.className = 'force-node'

        container.setAttribute('top', opts.top + 'px')
        container.setAttribute('left', opts.left + 'px')
        container.setAttribute('id', opts.id);

        container.innerText = opts.options.index;

        return container;
    }
}

export {TNode}