import express from 'express';
import fetchJson from './helpers/fetch-json.js';
import session from 'express-session';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({
    secret: 'FDND',
    resave: false,
    saveUninitialized: true,
}));


app.set('view engine', 'ejs');
app.set('views', './views');
app.set('port', process.env.PORT || 8000);

app.get('/', async (req, res) => {
    res.render('login');
});

app.post('/SDG', async (req, res) => {
    const apiUrl = 'https://fdnd-agency.directus.app/items/hf_sdgs';
    const response = await fetchJson(apiUrl);
    const data = response.data || [];
    const chosenStakeholder = req.body.chosenItem;
    req.session.data = data; 
    res.render('SDG', { data, chosenStakeholder: chosenStakeholder });
});

app.post('/stakeholder', async (req, res) => {
    const apiUrl = 'https://fdnd-agency.directus.app/items/hf_stakeholders';
    const response = await fetchJson(apiUrl);
    const data = response.data || [];
    res.render('stakeholder', { data });
});

app.post('/vragenlijst', async (req, res) => {
    const apiUrl = 'https://fdnd-agency.directus.app/items/hf_sdgs';
    const response = await fetchJson(apiUrl);
    const data = response.data || [];
    req.session.data = data; 
    res.render('vragenlijst', { data });
});

app.post('/dashboard', async (req, res) => {
    const apiUrl = 'https://fdnd-agency.directus.app/items/hf_sdgs';
    const response = await fetchJson(apiUrl);
    const data = response.data || [];
    req.session.data = data; 
    res.render('dashboard', { data });
});

app.post('/ClickedImagesSDG', (req, res) => {
    const { clickedImages } = req.body;
    console.log(clickedImages)
    req.session.clickedImages = clickedImages; // Store clickedImages in session
    res.json({ success: true });
});

app.get('/vragenlijst', async (req, res) => {
    const apiUrl = 'https://fdnd-agency.directus.app/items/hf_sdgs';
    const response = await fetchJson(apiUrl);
    const data = response.data || [];
    const clickedImages = req.session.clickedImages || [];
    res.render('vragenlijst', { data, clickedImages });
});

app.listen(app.get('port'), () => {
    console.log(`Applicatie gestart op http://localhost:${app.get('port')}`);
});