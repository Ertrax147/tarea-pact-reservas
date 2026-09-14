const { PactV3, MatchersV3 } = require('@pact-foundation/pact');
const axios = require('axios');
const path = require('path');

const { like } = MatchersV3;

const provider = new PactV3({
    consumer: 'Servicio de Administración',
    provider: 'Servicio de Reservas',
    dir: path.resolve(__dirname, '../../pacts')
});

describe('Pact con Servicio de Reservas - Servicio de Administración', () => {

    describe('Contrato 3: Verificar una reserva', () => {
        it('Reserva existente', async () => {
            provider
                .given('La reserva R-1001 existe y está activa')
                .uponReceiving('una solicitud para verificar la reserva R-1001')
                .withRequest({
                    method: 'GET',
                    path: '/reservas/R-1001'
                })
                .willRespondWith({
                    status: 200,
                    headers: { 'Content-Type': 'application/json; charset=utf-8' },
                    body: {
                        valid: true,
                        reserva: {
                            id: 'R-1001',
                            userId: like('U100'),
                            sala: like('SALA-1'),
                            fecha: like('2026-10-10'),
                            horas: like(2),
                            activa: true
                        }
                    }
                });

            await provider.executeTest(async (mockserver) => {
                const response = await axios.get(`${mockserver.url}/reservas/R-1001`);
                expect(response.status).toEqual(200);
                expect(response.data.valid).toEqual(true);
                expect(response.data.reserva.id).toEqual('R-1001');
            });
        });

        it('Reserva inexistente', async () => {
            provider
                .given('Se intenta consultar un identificador de reserva que no existe')
                .uponReceiving('una solicitud para verificar la reserva R-9999')
                .withRequest({
                    method: 'GET',
                    path: '/reservas/R-9999'
                })
                .willRespondWith({
                    status: 404,
                    headers: { 'Content-Type': 'application/json; charset=utf-8' },
                    body: {
                        valid: false,
                        error: like('Reserva no válida')
                    }
                });

            await provider.executeTest(async (mockserver) => {
                try {
                    await axios.get(`${mockserver.url}/reservas/R-9999`);
                } catch (error) {
                    expect(error.response.status).toEqual(404);
                    expect(error.response.data.valid).toEqual(false);
                }
            });
        });
    });
});
