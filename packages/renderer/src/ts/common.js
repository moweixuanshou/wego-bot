function convert(num) {
    const lookup ={M:1000,CM:900,D:500,CD:400,C:100,XC:90,L:50,XL:40,X:10,IX:9,V:5,IV:4,I:1};
    let romanStr = "";
    for (let i in lookup){
        while (num >= lookup[i]){
            romanStr+=i;
            num -= lookup[i];
        }
    }
    return romanStr;
}

function debounce(fn,wait,flag){
    let timeout;
    return function(){
        let self = this;
        let _args = arguments;
        if(timeout) clearTimeout(timeout);

        if(flag){
            let callNow = !timeout;
            timeout = setTimeout(function(){
                timeout = null;
            }, wait);

            if(callNow){
                fn.apply(self,_args);
            }
        }else{
            timeout = setTimeout(function(){
                fn.apply(self,_args);
            }, wait);
        }
    }
}

function throttle(fn,wait){
    let pre = 0;
    return function(){
        const self = this;
        const _args = arguments;
        let now =  +new Date();
        if(now-pre>wait){
            fn.apply(self,_args);
            pre = now;
        }
    }
}

function arrRemove(arr,item){
    const index = arr.indexOf(item)
    if(index>-1){
        arr.splice(index,1)
    }
}



export {convert, debounce, throttle, arrRemove}