import { Request, Response } from 'express';

interface HelloResponse {
  hello: string;
}

type HelloBuilder = (name: string) => HelloResponse;

const helloBuilder: HelloBuilder = name => ({ hello: name });

export const rootHandler = (_req: Request, res: Response) => {
  return res.send('Hello, Your API is working!!');
};

export const helloHandler = (req: Request, res: Response) => {
  const { params } = req;
  const { name = 'World' } = params;
  const response = helloBuilder(name);

  return res.json(response);
};

interface TestResponse {
  id: string
}
type TestBuilder = (id: string) => TestResponse;
const testBuilder: TestBuilder = ids => ({ id: ids });
export const testHandler = (req: Request, res: Response) => {
  const { id } = req.query;
  const response = { name: id };
  res.json(response);
};