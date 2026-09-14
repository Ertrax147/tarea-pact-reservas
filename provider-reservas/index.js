const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Almacenamiento en memoria
let reservas = [];

// Endpoint para limpiar estado (necesario para las pruebas de Pact)
app.post('/setup-state', (req, res) => {
    const state = req.body.state;
    reservas = []; // Limpiar antes de cada prueba

    if (state === 'El usuario U100 posee al menos una reserva activa') {
        reservas.push({
            id: 'R-1000',
            userId: 'U100',
            sala: 'SALA-1',
            fecha: '2026-10-10',
            horas: 2,
            activa: true
        });
    } else if (state === 'El usuario U200 no posee reservas') {
        // No agregamos nada
    } else if (state === 'La reserva R-1001 existe y está activa') {
        reservas.push({
            id: 'R-1001',
            userId: 'U100',
            sala: 'SALA-1',
            fecha: '2026-10-10',
            horas: 2,
            activa: true
        });
    } else if (state === 'Se intenta consultar un identificador de reserva que no existe') {
        // No agregamos nada
    } else if (state === 'El consumidor solicita una reserva con una cantidad de horas válida') {
        // El estado está limpio, listo para crear
    } else if (state === 'El consumidor intenta crear una reserva indicando una duración de 0 horas') {
        // Listo
    }

    res.json({ status: 'ok' });
});

// 1. Crear una reserva
app.post('/reservas', (req, res) => {
    const { userId, sala, fecha, horas } = req.body;

    if (!horas || horas <= 0) {
        return res.status(400).json({ error: 'La cantidad de horas es inválida' });
    }

    const nuevaReserva = {
        id: `R-${Math.floor(Math.random() * 10000)}`,
        userId,
        sala,
        fecha,
        horas,
        activa: true
    };
    
    reservas.push(nuevaReserva);
    res.status(201).json(nuevaReserva);
});

// 2. Consultar reservas de un usuario
app.get('/reservas', (req, res) => {
    const userId = req.query.userId;
    if (!userId) {
        return res.status(400).json({ error: 'userId es requerido' });
    }

    const reservasUsuario = reservas.filter(r => r.userId === userId);
    res.json(reservasUsuario); // Retorna array vacío si no hay
});

// 3. Verificar una reserva
app.get('/reservas/:id', (req, res) => {
    const id = req.params.id;
    const reserva = reservas.find(r => r.id === id);

    if (!reserva || !reserva.activa) {
        return res.status(404).json({ valid: false, error: 'Reserva no válida' });
    }

    res.json({ valid: true, reserva });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servicio de Reservas corriendo en el puerto ${PORT}`);
});
