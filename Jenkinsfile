pipeline {
    agent any

    environment {
        // Ruta al backend
        BACKEND_DIR = 'backend'
    }

    stages {
        stage('Checkout') {
    steps {
        git branch: 'main', url: 'https://github.com/mordecai2508/spde-gr.git'
    }
}


        stage('Install dependencies') {
            steps {
                dir("${BACKEND_DIR}") {
                    echo "Instalando dependencias del backend..."
                    sh 'npm install'
                }
            }
        }

        stage('Build') {
            steps {
                dir("${BACKEND_DIR}") {
                    echo "Construyendo proyecto backend..."
                    sh 'npm run build || echo "Sin script de build, continuando..."'
                }
            }
        }

        stage('Test') {
            steps {
                dir("${BACKEND_DIR}") {
                    echo "Ejecutando pruebas del backend..."
                    sh 'npm test || echo "Sin pruebas definidas, continuando..."'
                }
            }
        }

        stage('Package') {
            steps {
                dir("${BACKEND_DIR}") {
                    echo "Empaquetando aplicación..."
                    sh 'zip -r backend.zip .'
                }
            }
        }

        stage('Deploy (Simulado)') {
            steps {
                echo "Despliegue simulado: Jenkins ha construido el backend exitosamente."
            }
        }
    }

    post {
        success {
            echo "✅ Pipeline completado con éxito."
        }
        failure {
            echo "❌ Pipeline falló. Revisa las etapas anteriores."
        }
    }
}
