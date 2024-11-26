import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'

// Perque el navegador confï amb el certificat s'ha de ficar la seguent comanda a windows -> Import-Certificate -FilePath "ca.pem" -CertStoreLocation Cert:\LocalMachine\Root

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    https: {
      key: fs.readFileSync('cert-key.pem'), // Ruta a tu clave privada
      cert: fs.readFileSync('fullchain.pem'), // Ruta a tu certificado
    },
    port: 5173, // Puedes cambiar el puerto si es necesario
  }
})
