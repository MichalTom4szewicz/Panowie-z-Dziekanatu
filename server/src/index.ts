import app from'./app'
import {createConnection, Connection} from "typeorm";

const http = require('http')
const logger = require('./utils/logger')

const server = http.createServer(app)
const PORT = 8000;


server.listen(PORT, async () => {
  await createConnection()
    .then(() => {
      logger.info("Created database connections pool");
    });
  logger.info(`Server running on port ${PORT}`)
})

















































// let db = new sqlite3.Database('./db/db_file.db', (err: Error) => {
//   if (err) {
//     return console.error(err.message);
//   }
//   console.log('Connected to the in-memory SQlite database.');
// });


// db.serialize(() => {
//   // db.run('CREATE TABLE users(id integer primary key autoincrement, name text NOT NULL)')
//   // db.run(`INSERT INTO users(name)
//   //   VALUES('Miki'),
//   //         ('Diki'),
//   //         ('Ziki')`
//   // )

//   let tab = {
//     users: [],
//   }

//   db.each(`SELECT id, name FROM users`, (err: Error, row: any) => {
//     if (err){
//       throw err;
//     }
//   console.log(row.id, row.name);
//   });
// });

// // db.close((err: Error) => {
// //   if (err) {
// //     return console.error(err.message);
// //   }
// //   console.log('Close the database connection.');
// // });