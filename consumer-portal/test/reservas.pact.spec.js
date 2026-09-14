const { PactV3, MatchersV3 } = require('@pact-foundation/pact');
const axios = require('axios');
const path = require('path');

const { like, eachLike } = MatchersV3;

const provider = new PactV3({
    consumer: 'Portal de Usuario',
    provider: 'Servicio de Reservas',
    dir: path.resolve(__dirname, '../../pacts')
});

describe('Pact con Servicio de Reservas - Portal de Usuario', () => {

    describe('Contrato 1: Crear una reserva', () => {
        it('Reserva válida', async () => {
            provider
                .given('El consumidor solicita una reserva con una cantidad de horas válida')
                .uponReceiving('una solicitud para crear una reserva válida')
                .withRequest({
                    method: 'POST',
                    path: '/reservas',
                    headers: { 'Content-Type': 'application/json' },
                    body: {
                        userId: 'U100',
                        sala: 'SALA-1',
                        fecha: '2026-10-10',
                        horas: 2
                    }
                })
                .willRespondWith({
                    status: 201,
                    headers: { 'Content-Type': 'application/json; charset=utf-8' },
                    body: {
                        id: like('R-1234'),
                        userId: 'U100',
                        sala: 'SALA-1',
                        fecha: '2026-10-10',
                        horas: 2,
                        activa: true
                    }
                });

            await provider.executeTest(async (mockserver) => {
                const response = await axios.post(`${mockserver.url}/reservas`, {
                    userId: 'U100',
                    sala: 'SALA-1',
                    fecha: '2026-10-10',
                    horas: 2
                });
                expect(response.status).toEqual(201);
                expect(response.data.id).toBeDefined();
                expect(response.data.activa).toEqual(true);
            });
        });

        it('Reserva inválida (0 horas)', async () => {
            provider
                .given('El consumidor intenta crear una reserva indicando una duración de 0 horas')
                .uponReceiving('una solicitud para crear una reserva inválida')
                .withRequest({
                    method: 'POST',
                    path: '/reservas',
                    headers: { 'Content-Type': 'application/json' },
                    body: {
                        userId: 'U100',
                        sala: 'SALA-1',
                        fecha: '2026-10-10',
                        horas: 0
                    }
                })
                .willRespondWith({
                    status: 400,
                    headers: { 'Content-Type': 'application/json; charset=utf-8' },
                    body: {
                        error: like('La cantidad de horas es inválida')
                    }
                });

            await provider.executeTest(async (mockserver) => {
                try {
                    await axios.post(`${mockserver.url}/reservas`, {
                        userId: 'U100',
                        sala: 'SALA-1',
                        fecha: '2026-10-10',
                        horas: 0
                    });
                } catch (error) {
                    expect(error.response.status).toEqual(400);
                    expect(error.response.data.error).toEqual('La cantidad de horas es inválida');
                }
            });
        });
    });

    describe('Contrato 2: Consultar reservas de un usuario', () => {
        it('Usuario con reservas', async () => {
            provider
                .given('El usuario U100 posee al menos una reserva activa')
                .uponReceiving('una solicitud para obtener las reservas del usuario U100')
                .withRequest({
                    method: 'GET',
                    path: '/reservas',
                    query: { userId: 'U100' }
                })
                .willRespondWith({
                    status: 200,
                    headers: { 'Content-Type': 'application/json; charset=utf-8' },
                    body: eachLike({
                        id: like('R-1000'),
                        userId: 'U100',
                        sala: like('SALA-1'),
                        fecha: like('2026-10-10'),
                        horas: like(2),
                        activa: like(true)
                    })
                });

            await provider.executeTest(async (mockserver) => {
                const response = await axios.get(`${mockserver.url}/reservas?userId=U100`);
                expect(response.status).toEqual(200);
                expect(Array.isArray(response.data)).toBe(true);
                expect(response.data.length).toBeGreaterThan(0);
                expect(response.data[0].userId).toEqual('U100');
            });
        });

        it('Usuario sin reservas', async () => {
            provider
                .given('El usuario U200 no posee reservas')
                .uponReceiving('una solicitud para obtener las reservas del usuario U200')
                .withRequest({
                    method: 'GET',
                    path: '/reservas',
                    query: { userId: 'U200' }
                })
                .willRespondWith({
                    status: 200,
                    headers: { 'Content-Type': 'application/json; charset=utf-8' },
                    body: []
                });

            await provider.executeTest(async (mockserver) => {
                const response = await axios.get(`${mockserver.url}/reservas?userId=U200`);
                expect(response.status).toEqual(200);
                expect(response.data).toEqual([]);
            });
        });
    });
});
