# ---------- Build ----------
FROM node:20-alpine AS build
WORKDIR /app

# 1) Copia TODO el front primero
COPY Frontend/. .

# 2) Asegura que no traes node_modules del host (por si están en el repo)
RUN rm -rf node_modules

# 3) Instala deps y construye
#    (si luego agregas package-lock.json podrías cambiar a `npm ci`)
RUN npm install
RUN npm run build

# ---------- Runtime ----------
FROM node:20-alpine
WORKDIR /app

# Copiamos server standalone + estáticos + public
COPY --from=build /app/.next/standalone/ ./
COPY --from=build /app/.next/static ./ .next/static/
COPY --from=build /app/public ./public/

ENV HOST=0.0.0.0
ENV PORT=3000
EXPOSE 3000
CMD ["node", "server.js"]
