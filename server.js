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

// Render login page
app.get('/', async (req, res) => {
    const apiUrl = 'https://fdnd-agency.directus.app/items/hf_sdgs';
    const response = await fetchJson(apiUrl);
    const data = response.data || [];
    req.session.data = data; 
    res.render('login', { data });
});

// Handle login form submission
app.post('/', async (req, res) => {
    // Handle login form submission logic if needed
    res.redirect('/'); // Redirect to the login page
});

// Render stakeholder page
app.post('/stakeholder', async (req, res) => {
    const apiUrl = 'https://fdnd-agency.directus.app/items/hf_stakeholders';
    const response = await fetchJson(apiUrl);
    const data = response.data || [];
    res.render('stakeholder', { data });
});

// Render SDG page
app.post('/SDG', async (req, res) => {
    const apiUrl = 'https://fdnd-agency.directus.app/items/hf_sdgs';
    const response = await fetchJson(apiUrl);
    const data = response.data || [];
    req.session.data = data; 
    res.render('SDG', { data, chosenStakeholder: req.body.chosenItem });
});

// Handle clicked images for SDG
app.post('/ClickedImagesSDG', (req, res) => {
    const { clickedImages } = req.body;
    req.session.clickedImages = clickedImages; // Store clickedImages in session
    res.json({ success: true });
});

// Render questionnaire page
app.post('/vragenlijst', async (req, res) => {
    // Handle questionnaire form submission logic if needed
    res.redirect('/'); // Redirect to the login page
});

// Handle questionnaire page GET request
app.get('/vragenlijst', async (req, res) => {
    const apiUrl = 'https://fdnd-agency.directus.app/items/hf_sdgs';
    const response = await fetchJson(apiUrl);
    const data = response.data || [];
    const clickedImages = req.session.clickedImages || [];
    res.render('vragenlijst', { data, clickedImages });
});

// Render dashboard page
app.post('/dashboard', async (req, res) => {
    const apiUrl = 'https://fdnd-agency.directus.app/items/hf_sdgs';
    const response = await fetchJson(apiUrl);
    const data = response.data || [];
    
    const scores = {};
    for (const key in req.body) {
        if (key.endsWith('_rating')) {
            scores[key.split('_')[0]] = parseInt(req.body[key]);
        }
    }
    console.log(scores);
    
    // Send scores to dashboard.ejs
    res.render('dashboard', { data, scores });
});

app.listen(app.get('port'), () => {
    console.log(`Applicatie gestart op http://localhost:${app.get('port')}`);
});
