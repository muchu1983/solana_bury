import { do_bury, do_worship } from './solana_rpc.ts';
import express from 'express';

const app = express();
const port = 8080;

// use 中間件必須放在 路由前面
app.use(express.static('app/public')); // 使用靜態中間件
app.use(express.json()); // 使用 json 中間件

// 定義路由
app.get('/', (req, res) => {
    res.redirect(301, '/index.html');
});

// 測試埋葬指令
app.get('/bury', async (req, res) => {
    do_bury();
    res.send('bury some...<a href="/index.html">回主頁</a>');
});

// 測試埋葬指令
app.post('/bury', async (req, res) => {
    const received_data = req.body;
    if (!received_data || !received_data.bury_whose_tombstone) {
        return res.status(400).json({ error: 'Invalid data format' });
    }

    const whose_tombstone: string = received_data.bury_whose_tombstone
    console.log(`bury ${whose_tombstone}`);
    do_bury(whose_tombstone);

    res.json({
        status: 'success',
        received: received_data
    });
});

// 測試祭拜指令
app.get('/worship', async (req, res) => {
    do_worship();
    res.send('worship some...<a href="/index.html">回主頁</a>');
});

// 啟動http服務
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});