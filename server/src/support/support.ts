import { pbkdf2 } from "node:crypto";
import {Class} from "../entity/Class"
import {getConnection, Repository} from "typeorm";
import {Request, Response} from "express"
import axios from 'axios'

const logger = require('../utils/logger')

export function classesCollide (c1: Class, c2: Class): boolean {

    const c1Start = parseInt(c1.startTime.replace(":", ""), 10);
    const c1End = parseInt(c1.endTime.replace(":", ""), 10)

    const c2Start = parseInt(c2.startTime.replace(":", ""), 10);
    const c2End = parseInt(c2.endTime.replace(":", ""), 10)

    // console.log(c1Start, c1End, c2Start, c2End)

    // gdy parity1 xor parity2 == 1 mamy gwarancje ze nie koliduja
    // kiedy indziej moze wystapic kolizja
    if((c1.parity == 'p' && c2.parity == 'n') || (c1.parity == 'n' && c2.parity == 'p')) {
        return false
    }

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

    return false
}

export function compareClasses(c1: any, c2: any): number{
    const sTime1 = parseInt(c1.startTime.replace(":", ""), 10);
    const sTime2 = parseInt(c2.startTime.replace(":", ""), 10);

    return sTime1 - sTime2
}

export function compareCollisions(c1: any, c2: any): number{
    const sTime1 = parseInt(c1[1].startTime.replace(":", ""), 10);
    const sTime2 = parseInt(c2[1].startTime.replace(":", ""), 10);

    return sTime1 - sTime2
}

export function alterKeys(x: any, className: string): any {
    let new_x = []
    for(let item of x) {
        let new_item: {[key: string]: any} = {}
        for(let it of Object.keys(item)) {
            let copy = it.slice();
            let key = copy.replace(className+"_", "");
            new_item[key] = item[copy];
        }
        new_x.push(new_item);
    }

    return new_x;
}

export function processCollisions(newItems: Class[]):Array<Class[]> {
    let nonColliding: Array<Class[]>  = []
    let inserted = false
    let isColliding = false

    nonColliding.push([newItems[0]])
    for(let i=1; i<newItems.length; i++) {
        for(let j=0; j<nonColliding.length; j++) {
            for(let k=0; k<nonColliding[j].length; k++) {
                if(classesCollide(newItems[i], nonColliding[j][k])) {
                isColliding = true;
                }
            }
            if(!isColliding) {
                nonColliding[j].push(newItems[i]);
                inserted = true;
                isColliding = false;
                break;
            }
            isColliding = false;
        }
        if(!inserted) {
            nonColliding.push([newItems[i]]);
        }
        inserted = false;
    }
    return nonColliding
}

export function listCollisions(newItems: any): object {
    const processedItems = processCollisions(newItems);

    // array of map items
    let tmpMap = [];
    for(let i=0; i< processedItems.length; i++) {
        for(let j=0; j< processedItems[i].length; j++) {
            const item = processedItems[i][j];
            let newMapValue = []
            for(let k=0; k< processedItems.length; k++) {
                for(let l=0; l< processedItems[k].length; l++) {
                    if(i !== k) {
                        newMapValue.push([k, l]);
                    }
                }
            }
            tmpMap.push({1: item, 2:newMapValue});
        }
    }
    tmpMap.sort(compareCollisions);

    let map: {
        [key: string]: number[][]
    } = {}

    for(let i=0; i < tmpMap.length; i++) {
        map[tmpMap[i][1].groupKey] = tmpMap[i][2];
    }
    return map
}

export async function insertObjectIntoTable(object: any, table: any, response: Response) {
    await getConnection()
  .createQueryBuilder()
  .insert()
  .into(table)
  .values(object)
  .execute()
  .then(() => {
    response.status(200).json({
      status: "success"
    })
  })
  .catch(error => {
    logger.error(error)
    response.status(500).json({
      status: "failure",
      message: error.message
    })
  });
}

export function createTime(h: number, m: number) {
    let hString
    if(h.toString().length == 1) {
        hString = `0${h}`
    } else {
        hString = `${h}`
    }

    let mString
    if(m.toString().length == 1) {
        mString = `0${m}`
    } else {
        mString = `${m}`
    }

    return `${hString}:${mString}`
}

export function validateValues(val: any, enm: any, response: Response) {
    const enumValues = new Set(Object.values(enm))
    if(!enumValues.has(val)) {
        response.status(500).json({
            status: "failure",
            message: `invalid value: ${val}`
        })
        return false
    }
    return true
}

export function isTime(hours: any, minutes: any, response: Response) {
    if(!(hours >= 0 && hours <= 24)) {
        response.status(500).json({
            status: "failure",
            message: `invalid hour: ${hours}`
        })
        return false
    }
    if(!(minutes >= 0 && minutes <= 60)) {
        response.status(500).json({
            status: "failure",
            message: `invalid minutes: ${minutes}`
        })
        return false
    }
    return true
}

export async function verify(token: any, response: Response) {
    try {
        const auth = await axios.get("https://localhost:4848/verify",
        {headers: {'token': token}});

        if(!auth.data.success) {
            response.status(401).json({
                status: "failure",
                message: "invalid token"
            })
            return false
        }
        return auth.data.token
    } catch (e) {
        response.status(401).json({
            status: "failure",
            message: "no token found"
        })
        return false
    }
}

export function strToTime(str: string) {
    return {
        hours: parseInt(str.substr(0, 2)),
        minutes: parseInt(str.substr(3, 2))
    }
}

function isIterable(obj: any) {
    // checks for null and undefined
    if (obj == null) {
      return false;
    }
    return typeof obj[Symbol.iterator] === 'function';
  }

export function alterTimes(items: any): any {
    if (isIterable(items)) {
        let newItems = []
        for(let item of items) {
            let newItem = item;
            newItem.startTime = strToTime(item.startTime)
            newItem.endTime = strToTime(item.endTime)
            newItems.push(newItem);
        }
        return newItems;
    } else {
        let newItem = items;
        newItem.startTime = strToTime(items.startTime)
        newItem.endTime = strToTime(items.endTime)
        return newItem;
    }
}