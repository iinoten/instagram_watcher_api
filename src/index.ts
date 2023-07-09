import express, {Request} from 'express';
import { rootHandler, helloHandler, getLatestFollowersData } from './handlers';
import { main } from './puppeteer';

const app = express();
const port = process.env.PORT || '8000';

// ここでpuppeteerのブラウザを立ちあげちゃって(クラス生成しちゃって)あとは各ハンドラにオブジェクトを渡して使い回していく
// ↑ リクエストが被った時にどういう挙動になるかわからない(後発のリクエストと被ってブラウザが変な挙動になりそう)
app.get('/', main);
app.get('/hello/:name', helloHandler);
// TODO GPUがクラッシュする。最適化考えたほうがいい
app.get('/check', getLatestFollowersData);

app.listen(port, () => {
  return console.log(`Server is listening on ${port}`);
});