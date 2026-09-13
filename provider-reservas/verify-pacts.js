const { Verifier } = require('@pact-foundation/pact');
const path = require('path');

const opts = {
    provider: 'Servicio de Reservas',
    providerBaseUrl: 'http://localhost:3000',
    pactUrls: [
        path.resolve(__dirname, '../pacts/Portal de Usuario-Servicio de Reservas.json'),
        path.resolve(__dirname, '../pacts/Servicio de Administración-Servicio de Reservas.json')
    ],
    providerStatesSetupUrl: 'http://localhost:3000/setup-state'
};

new Verifier(opts).verifyProvider().then(() => {
    console.log('Pact Verification Complete!');
    process.exit(0);
}).catch(e => {
    console.error('Pact Verification Failed', e);
    process.exit(1);
});
