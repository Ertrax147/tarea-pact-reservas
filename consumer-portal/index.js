const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

const PROVIDER_URL = process.env.PROVIDER_URL || 'http://localhost:3000';

app.get('/mis-reservas/:userId', async (req, res) => {
    try {
        const response = await axios.get(`${PROVIDER_URL}/reservas?userId=${req.params.userId}`);
        res.json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json(error.response?.data || { error: 'Error del servidor' });
    }
});

app.post('/crear-reserva', async (req, res) => {
    try {
        const response = await axios.post(`${PROVIDER_URL}/reservas`, req.body);
        res.status(201).json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json(error.response?.data || { error: 'Error del servidor' });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Portal de Usuario corriendo en el puerto ${PORT}`);
});
