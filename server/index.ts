import express from 'express';
import "reflect-metadata";
const sqlite3 = require('sqlite3').verbose();


const app = express();
const PORT = 8000;


app.get('/', (req, res) => res.send('Hola amigo!!!'));
app.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`);
});

let db = new sqlite3.Database('./db/db_file.db', (err: Error) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to the in-memory SQlite database.');
});


db.serialize(() => {
  // db.run('CREATE TABLE greetings(message text)')
  db.run(`INSERT INTO greetings(message)
    VALUES('Hi'),
          ('Hello'),
          ('Welcome')`
  )
  .each(`SELECT message FROM greetings`, (err: Error, row: any) => {
    if (err){
      throw err;
    }
  console.log(row.message);
  });
});

// db.close((err: Error) => {
//   if (err) {
//     return console.error(err.message);
//   }
//   console.log('Close the database connection.');
// });