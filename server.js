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
    const stakeholderApiUrl = 'https://fdnd-agency.directus.app/items/hf_stakeholders';
    const sdgsApiUrl = 'https://fdnd-agency.directus.app/items/hf_sdgs';

    // Make API requests concurrently
    const [stakeholdersResponse, sdgsResponse] = await Promise.all([
        fetchJson(stakeholderApiUrl),
        fetchJson(sdgsApiUrl)
    ]);

    // Extract data from responses
    const stakeholdersData = stakeholdersResponse.data || [];
    const sdgsData = sdgsResponse.data || [];

    res.render('stakeholder', { stakeholdersData, sdgsData });
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
    
    
    // Send scores to dashboard.ejs
    res.render('dashboard', { data});
});

app.listen(app.get('port'), () => {
    console.log(`Applicatie gestart op http://localhost:${app.get('port')}`);
});
