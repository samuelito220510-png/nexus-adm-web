# NEXUS ADM SAS — Web

Sitio y panel de NEXUS ADM SAS. Aplicación React (Vite + TypeScript + Tailwind v4)
100% en el navegador (los datos de demo se guardan en `localStorage`).

- **Sitio público** con misión, visión, origen, servicios y línea beauty.
- **Panel** con selector de modo **Cliente / Trabajador**:
  - _Cliente_: crea solicitudes y chatea con su técnico asignado.
  - _Trabajador_: revisa la bandeja de solicitudes, cambia estados y chatea con el cliente.
- **Tienda beauty** con paquetes, carrito y confirmación de pedido.

## Desarrollo

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # genera dist/
npm run preview    # sirve el build
```

## Despliegue en GitHub Pages

El repositorio incluye `.github/workflows/deploy.yml`. Al hacer `push` a `main`,
GitHub Actions construye el proyecto y lo publica en GitHub Pages automáticamente.

Pasos únicos tras crear el repo en GitHub:

1. En **Settings → Pages → Build and deployment**, selecciona **GitHub Actions** como fuente.
2. Cada `push` a `main` vuelve a desplegar.

> El proyecto usa rutas por hash (`#/panel`) y `base: './'`, así que funciona en
> `https://<usuario>.github.io/<repo>/` sin configurar el nombre del repositorio.
