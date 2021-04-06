import {Class} from "../entity/Class"

export function classesCollide (c1: Class, c2: Class): boolean {

    const c1Start = parseInt(c1.startTime.replace(":", ""), 10);
    const c1End = parseInt(c1.endTime.replace(":", ""), 10)

    const c2Start = parseInt(c2.startTime.replace(":", ""), 10);
    const c2End = parseInt(c2.endTime.replace(":", ""), 10)

    // console.log(c1Start, c1End, c2Start, c2End)

    //c2 zaczyna sie w trakcie c1
    if(c2Start >= c1Start && c2Start <= c1End) {
        return true
    }
    //c2 konczy sie w trakcie c1
    if(c2End >= c1Start && c2End <= c1End) {
        return true
    }
    //c1 zaczyna sie w trakcie c2
    if(c1Start >= c2Start && c1Start <= c2End) {
        return true
    }
    //c1 konczy sie w trakcie c2
    if(c1End >= c2Start && c1End <= c2End) {
        return true
    }

    // console.log("false")

    return false
}

export function compareClasses(c1: any, c2: any): number{
    const sTime1 = parseInt(c1.startTime.replace(":", ""), 10);
    const sTime2 = parseInt(c2.startTime.replace(":", ""), 10);

    return sTime1 - sTime2
}

export function alter(x: any, className: string): any {
    let new_x = []
    for(let item of x) {
        let new_item = {}
        for(let it of Object.keys(item)) {
            let copy = it.slice();
            let key = copy.replace(className+"_", "");
            eval(`new_item[key] = item[copy]`);
        }
        new_x.push(new_item);
    }

    return new_x;
}
