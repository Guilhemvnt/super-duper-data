const express = require('express');
const path = require('path');
const app = express();
const PORT = 8080;
const LOCAL_IP = 'ip'; // Replace with your local IP address

// Serve files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, LOCAL_IP, () => {
    console.log(`Server is running on http://${LOCAL_IP}:${PORT}`);
});
