import express, { Request, Response, Router } from 'express';

const PORT = 4848;

const app = express();
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  return res.status(200).json({
    success: true,
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
