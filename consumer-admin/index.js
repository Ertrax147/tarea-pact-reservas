const express = require('express');
const axios = require('axios');
const app = express();

const PROVIDER_URL = process.env.PROVIDER_URL || 'http://localhost:3000';

app.get('/verificar/:id', async (req, res) => {
    try {
        const response = await axios.get(`${PROVIDER_URL}/reservas/${req.params.id}`);
        res.json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json(error.response?.data || { error: 'Error del servidor' });
    }
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
    console.log(`Servicio de Administración corriendo en el puerto ${PORT}`);
});
