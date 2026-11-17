# T-HÜMAN frontend — despliegue local (copia limpia)

Copia del frontend (Vue 3 + Vite 7) tal como se desplegó en local, **sin historial, sin `.env` ni `dist`**.

```
npm install
cp .env.example .env.local      # VITE_API_DEVELOPMENT=http://127.0.0.1:8000/api
node node_modules/vite/bin/vite.js --host 127.0.0.1 --port 5180     # Vite 7 requiere Node >= 20.19 (se usó Node 24)
```
Login interno: `/login/internal` · login de candidatos: `/login`.

Se quitó la IP interna y un contacto personal del User-Agent en `src/services/ageOfMajorityService.js`.
