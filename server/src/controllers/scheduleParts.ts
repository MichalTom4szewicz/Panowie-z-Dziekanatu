import {getConnection} from "typeorm";
import {Class} from "../entity/Class";
import {SchedulePart} from "../entity/schedulePart";
import {User} from '../entity/User'
import {Request, Response} from "express"

const logger = require('../utils/logger')
const schedulePart = require('express').Router()

schedulePart.delete('/deleteDummy', async (request: Request, response: Response) => {
//   await getConnection()
//     .createQueryBuilder()
//     .delete()
//     .from(SchedulePart)
//     .where("schedulePart.id > :id", { id: 0 })
//     .execute()
//     .then(() => {
//       return response.json({status: "jest w pyte"})
//     })
//     .catch(error => logger.error(error));

    const connection = await getConnection();
    const sPartRepository = connection.getRepository(SchedulePart)

    await sPartRepository.clear()
    .then(() => {
              return response.json({status: "jest w pyte"})
            });
})

schedulePart.post('/addDummy', async (request: Request, response: Response) => {
    const connection = await getConnection();
    const userRepository = connection.getRepository(User)
    const classRepository = connection.getRepository(Class)

    console.log('1')

    const usr1 = await userRepository.findOne({pesel: "1"});
    const usr2 = await userRepository.findOne({pesel: "2"});

    console.log('1')

    const cls1 = await classRepository.findOne({groupKey: "k1g1"})
    const cls2 = await classRepository.findOne({groupKey: "k1g1"})

    console.log('1')


    const css = [
        {
            name: "plandwa",
            owner: usr1,
            class: cls1
        },
        {
            name: "plandwa",
            owner: usr1,
            class: cls2
        },
        {
            name: "plancztery",
            owner: usr2,
            class: cls2
        }
    ]

    await getConnection()
    .createQueryBuilder()
    .insert()
    .into(SchedulePart)
    .values(css)
    .execute()
    .then(() => {
      return response.json(css)
    })
    .catch(error => logger.error(error));
})

//all scheduleparts
// localhost:8000/scheduleparts/all
schedulePart.get('/all', async (request: Request, response: Response) => {
    // const connection = await getConnection();
    // const sPartRepository = connection.getRepository(SchedulePart)

    // const sParts = await sPartRepository.find();
    // return response.json(sParts)

    // await getConnection()
    // .createQueryBuilder()
    // .select("schedulePart")
    // .from(SchedulePart, "schedulePart")
    // .where("class.weekDay = :weekDay", {weekDay: request.query.weekDay})
    // .execute()
    // .then(items => {
    //   let newItems = alterKeys(items, "class");
    //   newItems.sort(compareClasses);
    //   const map = listCollisions(newItems);

    //   return response.status(200).json(map)
    // })
    // .catch(error => {
    //   logger.error(error);
    //   return response.status(500).json({
    //     success: false,
    //     status: "nk rzutnik"
    //   })
    // });
})

// PZD-10
// getPlan(nazwa) -> Classes[]
// localhost:8000/scheduleparts?name=mojplan
schedulePart.get('/', async (request: Request, response: Response) => {
    const connection = await getConnection();
    const sPartRepository = connection.getRepository(SchedulePart)

    const sParts = await sPartRepository.find({where:{name: request.query.name}});

    let classes = []
    for (let item of sParts) {
        classes.push(item.class)
    }

    return response.status(200).json(classes)
})


// PZD-10
// zapiszPlan(plan: Classes[]): void
// localhost:8000/scheduleparts?name=mojplan
schedulePart.post('/', async (request: Request, response: Response) => {
    const classes = request.body.classes

    await getConnection()
    .createQueryBuilder()
    .insert()
    .into(SchedulePart)
    .values(classes)
    .execute()
    .then(() => {
      return response.status(200).json({
          status: "success"
      })
    })
    .catch(error => {
        logger.error(error)
        return response.status(500).json({
            status: "failure"
        })
    });
})




export default schedulePart;