const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

// مفتاح AssemblyAI الخاص بالوكيل الصوتي
const AAI_KEY = "5ce8d938cb0c4497abebb6cb05732746"; 

 // 1. مسار جلب توكن "الوكيل الصوتي الشامل"
app.get('/api/token/agent', async (req, res) => {
    try {
        const response = await axios.get('https://agents.assemblyai.com/v1/token', {
            params: { expires_in_seconds: 600 },
            headers: { Authorization: `Bearer ${AAI_KEY}` }
        });
        res.json({ token: response.data.token });
    } catch (error) {
        console.error("Agent Token Error:", error.message);
        res.status(500).json({ error: "Failed to fetch agent token" });
    }
});

// 2. مسار الصياغة الذكية (العصا السحرية) باستخدام خدمة Pollinations السريعة والمجانية
app.post('/api/formulate', async (req, res) => {
    let text = req.body.text || "";
    try {
        const response = await axios.post('https://text.pollinations.ai/', {
            messages: [
                { role: "system", content: "أنت خبير موارد بشرية محترف. قم بصياغة النص التالي الذي يقوله المستخدم بالعامية، وحوله إلى نقطة احترافية وموجزة جداً باللغة العربية الفصحى لتوضع مباشرة في السيرة الذاتية. أرسل الجملة المصاغة فقط بدون أي مقدمات أو شرح." },
                { role: "user", content: text }
            ]
        }, {
            headers: { 'Content-Type': 'application/json' }
        });
        
        // إرسال النص المصاغ للواجهة
        res.json({ result: response.data });
    } catch (error) {
        console.error("Formulate Error:", error.message);
        // في حالة الخطأ، يرجع النص كما هو بدون ما يوقف الموقع
        res.json({ result: text }); 
    }
});

// التعديل الخاص بـ Render (مهم جداً عشان يشتغل أونلاين)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ CVoxPuzzle Security Server is running on port ${PORT}`);
});