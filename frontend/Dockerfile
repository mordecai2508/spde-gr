# Etapa 1: Construcción del proyecto con Node
FROM node:18-alpine AS build

WORKDIR /usr/src/app

# Instala dependencias
COPY package*.json ./
RUN npm install

# Copia el resto del código del frontend
COPY . .

# Construye los archivos estáticos para producción
RUN npm run build

# Etapa 2: Servir los archivos estáticos con NGINX
FROM nginx:alpine

# Copia los archivos construidos desde la etapa anterior
COPY --from=build /usr/src/app/dist /usr/share/nginx/html

# Exponer el puerto estándar de NGINX
EXPOSE 80

# Comando de inicio de NGINX
CMD ["nginx", "-g", "daemon off;"]
