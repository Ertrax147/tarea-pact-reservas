# Tarea: Pruebas de Contrato en Microservicios con Pact

Este repositorio contiene la implementación de un sistema de reservas compuesto por tres microservicios y la validación de sus comunicaciones mediante Pruebas de Contrato utilizando Pact.

## Estructura del Proyecto

- `provider-reservas/`: Servicio principal que gestiona las reservas.
- `consumer-portal/`: Portal de Usuario (Consumidor 1) que consulta y crea reservas.
- `consumer-admin/`: Servicio de Administración (Consumidor 2) que verifica reservas.
- `pacts/`: Carpeta donde se generan automáticamente los contratos JSON.

## Cómo levantar el sistema (Docker)

1. Asegúrate de tener Docker y Docker Compose instalados.
2. Desde la raíz del repositorio, ejecuta:
   ```bash
   docker compose up -d
   ```
3. Los servicios estarán disponibles en:
   - Proveedor de Reservas: `http://localhost:3000`
   - Portal de Usuario: `http://localhost:3001`
   - Servicio de Administración: `http://localhost:3002`

## Cómo ejecutar las pruebas de los consumidores y generar los contratos Pact

Para generar los contratos, debes ejecutar las pruebas en cada uno de los consumidores. Esto creará (o actualizará) los archivos en la carpeta `pacts/` ubicada en la raíz.

**Para el Portal de Usuario:**
```bash
cd consumer-portal
npm install
npm test
```

**Para el Servicio de Administración:**
```bash
cd consumer-admin
npm install
npm test
```

Una vez ejecutadas las pruebas, verás los contratos JSON generados en la carpeta `../pacts`.

## Cómo verificar el Servicio de Reservas

Para verificar que el proveedor cumple con los contratos generados:

```bash
cd provider-reservas
npm install
npm run verify-pact
```
El script leerá los contratos generados y verificará los endpoints. Internamente, `verify-pacts.js` utiliza el endpoint `/setup-state` del proveedor para preparar los datos reproducibles antes de cada prueba de contrato.

## Dificultades encontradas (Para el video / informe)

- **Configuración de States (Estados de Prueba):** Fue necesario crear un endpoint `/setup-state` en el proveedor para poder inyectar datos (como reservas activas o vacías) antes de que Pact ejecutara las validaciones.
- **Orquestación en Docker:** Asegurar que los consumidores pudieran comunicarse con el proveedor mediante `PROVIDER_URL=http://provider-reservas:3000` dentro de la red de Docker.
