import { do_bury, do_worship } from './solana_rpc.ts';
import express from 'express';

const app = express();
const port = 8080;

// 定義路由
app.get('/', (req, res) => {
  res.send('\uD840\uDC03\uD840\uDC03\uD840\uDC03Welcome to solana_bury project.𠀃𠀃𠀃');
});
// 測試埋葬指令
app.get('/bury', async (req, res) => {
  do_bury()
  res.send('bury some...<a href="/index.html">回主頁</a>');
});
// 測試祭拜指令
app.get('/worship', async (req, res) => {
  do_worship()
  res.send('worship some...<a href="/index.html">回主頁</a>');
});

// 使用靜態中間件
app.use(express.static('app/public')); 
// 啟動http服務
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
