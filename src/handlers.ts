import { Request, Response } from 'express';
import {getFollowerDataFromInstagramApp} from './followerDataController';

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
export const getLatestFollowersData = (req: Request, res: Response) => {
  const id = req.query.id as string;
  const response = { name: id };
  getFollowerDataFromInstagramApp(id).then(response => {
    
    res.json(response);
  })
};