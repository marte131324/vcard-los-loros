# Registro de Cambios Técnicos - VCard Los Loros
## Fecha: 1 de Abril de 2026
## Desarrollador: Antigravity AI

---

### 1. Sistema de Variantes Dinámicas (Multi-Grupo)
Se ha implementado un nuevo motor de variantes en `js/app.js` que permite asignar grupos de opciones independientes a un mismo producto.
- **Estructura de Datos**: El objeto `PRODUCT_VARIANTS` ahora soporta tanto objetos simples de una sola opción como arrays de objetos para múltiples selecciones.
- **Lógica de Emparejamiento**: Las variantes se asignan mediante un algoritmo de búsqueda por "palabra clave más específica" (orden descendente por longitud), evitando que términos genéricos gatillen variantes erróneas.
- **Validación de Checkboxes**: Se añadió lógica para controlar el número exacto de selecciones en grupos tipo checkbox (Ej: Guarniciones de Milanesa/Filete).

### 2. Refinamiento en el Catálogo de Productos
Se han optimizado los siguientes productos para asegurar que el pedido llegue sin errores por WhatsApp:
- **Ensalada de la Casa**: Se añadieron las 5 opciones específicas (Pollo Natural, Pollo revuelto con 3 tipos de aderezo y Atún).
- **Chilaquiles Preparados**: Se separó la selección de Proteína y Salsa en dos pasos obligatorios.
- **Antojitos Preparados**: Se integró la selección obligatoria de Salsa (5 tipos) para todas las Picadas, Empanadas y Tostadas preparadas.
- **Guarniciones**: Se limitaron las opciones de Milanesa y Filete a (Verduras, Papas/Pasta, Ensalada) con selección obligatoria de 2 elementos.

### 3. Mejora en UX (Checkout Rápido)
- **Exclusión de Sencillos**: Se ajustó la lógica para que los productos marcados como "Sencillos" no abran el modal de variantes, agilizando el flujo de compra para pedidos básicos.
- **Limpieza de Envíos**: Se eliminó la opción "Zona Cercana" del formulario de checkout, dejando únicamente "Zona Extendida" y "Pasaré a recoger" para simplificar la logística.

### 4. Actualizaciones de UI/UX
- **Styles**: Se añadieron estilos CSS específicos en `style.css` para la cuadrícula de variantes (`.variants-grid`) y los estados de selección táctiles.
- **Responsive**: El modal de variantes está optimizado para dispositivos móviles, utilizando botones grandes para facilitar el uso en pantallas táctiles.

### 5. Despliegue
- El proyecto ha sido desplegado exitosamente en **Vercel** ([vcard-los-loros.vercel.app](https://vcard-los-loros.vercel.app)).
