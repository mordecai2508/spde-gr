# Usa una imagen base ligera de Node
FROM node:18-alpine

# Crea el directorio de trabajo
WORKDIR /usr/src/app

# Copia los archivos de dependencias primero (para cachear)
COPY package*.json ./

# Instala dependencias
RUN npm install --production

# Copia el resto del código del backend
COPY . .

# Expone el puerto del backend
EXPOSE 3006

# Define variables de entorno opcionales (ajusta según tu .env)
ENV NODE_ENV=production

# Comando de inicio
CMD ["npm", "start"]
