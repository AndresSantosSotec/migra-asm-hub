Autenticación — Frontend + Backend (Laravel Sanctum)

Este documento explica cómo conectar el frontend de `migra-asm-hub` con tu backend Laravel (endpoints de `login` y `logout` que compartiste), la configuración CORS/Sanctum necesaria y los pasos para probar en desarrollo.

1) Rutas en Laravel (routes/api.php)

Asegúrate de tener las rutas apuntando a tu controlador `LoginController`:

```php
use App\Http\Controllers\Api\LoginController;

Route::post('/login', [LoginController::class, 'login']);
Route::post('/logout', [LoginController::class, 'logout'])->middleware('auth:sanctum');
```

Si tus rutas están dentro de un prefijo `api` (archivo `routes/api.php` por defecto usa `api/`), y tu `VITE_API_URL` es `http://192.168.1.100/api`, las llamadas frontend a `/login` y `/logout` irán a `http://192.168.1.100/api/login` y `.../logout`.

2) CORS (config/cors.php)

Permite solicitudes desde tu frontend de desarrollo. Ejemplo mínimo:

```php
return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],
    'allowed_methods' => ['*'],
    'allowed_origins' => ['http://localhost:8080', 'http://192.168.1.100:8080'],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true,
];
```

Reinicia el servidor Laravel tras los cambios.

3) Sanctum / tokens

Tu controlador usa `createToken(...)->plainTextToken` (token personal). El frontend debe enviar el header `Authorization: Bearer <token>` en cada petición protegida. En el frontend, `src/lib/auth.ts` ya guarda el token y añade ese header globalmente.

Si prefieres usar autenticación basada en cookies y sesiones, tendrías que:

- Llamar a `GET /sanctum/csrf-cookie` desde el frontend antes de login
- Usar axios con `withCredentials: true`
- Configurar `sanctum.stateful` en `config/sanctum.php` con el host del frontend

4) Frontend (Vite) — configuración importante

- Asegúrate de tener la variable de entorno `VITE_API_URL` en `.env.local` o `.env` con la URL base (incluye `/api` si tu backend la usa):

```
VITE_API_URL=http://192.168.1.100/api
```

- `src/lib/auth.ts` está configurado para hacer POST a `/login` y `/logout` en esa baseURL.

5) Probar el login (pasos)

- En PowerShell (en la raíz del repo):

```powershell
# instalar deps (si no lo hiciste)
npm install

# iniciar Vite
npm run dev
```

- Abrir el navegador en `http://localhost:8080` (o `http://192.168.1.100:8080` si accedes desde otra máquina y ajustaste `vite.config.ts` hmr.host a tu IP).
- En la página de login, usa credenciales válidas del backend.

6) Troubleshooting HMR / WebSocket

- Si ves errores `WebSocket connection to 'ws://localhost:8080/?token=...' failed`:
  - Si estás en la misma máquina, usa `hmr.host: 'localhost'` (ya configurado en `vite.config.ts`).
  - Si accedes desde otro equipo, cambia `hmr.host` a la IP de la máquina que ejecuta Vite (ej. `192.168.1.100`).
  - Si estás detrás de un proxy HTTP/2 que causa `ERR_HTTP2_PROTOCOL_ERROR`, ejecuta Vite directamente (sin proxy) o configúrale `hmr.protocol = 'wss'` con TLS.

7) Ejemplo de flujo desde el frontend

- `login(email,password)` -> POST `/login`
  - Si devuelve `token` y `user`, el frontend guarda token y user y añade `Authorization` header global con `Bearer`.
  - Luego redirige a `/dashboard` si `user.role_id === 1` o `user.id === 6`.
- `logout()` -> POST `/logout`
  - Llama al endpoint protegido, y limpia token y user localmente.

8) Nota sobre la estructura actual del frontend

- `src/lib/auth.ts` contiene las funciones `login`, `logout`, `setToken`, `setUser`, `getCurrentUser`, `isAdminOrSpecialUser`.
- `src/hooks/use-auth.tsx` expone `handleLogin` y maneja la navegación y errores.
- `src/components/ProtectedRoute.tsx` protege rutas y redirige a `/login` o `/404`.

9) Si quieres que lo haga por ti

Puedo:
- Ajustar `vite.config.ts` para usar tu IP (dímela),
- Cambiar `VITE_API_URL` en `.env.local` a `http://localhost:8000/api` si tu Laravel corre localmente, o a la IP del servidor,
- Convertir `auth.ts` para usar `withCredentials` y flujo CSRF si prefieres cookies/sanctum, o dejar tokens como ahora.

10) Contacto

Si compartes:
- la URL/IP del backend en el que quieres probar, y
- si deseas tokens (Bearer) o cookies (session)

Puedo ajustar las configuraciones y probar el ciclo completo.
