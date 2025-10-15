pipeline {
    agent any
    
    environment {
        NODE_ENV = 'test'
        DB_HOST = 'host.docker.internal'  // ← CLAVE
        DB_USER = 'root'
        DB_PASSWORD = 'tu_password'
        DB_NAME = 'spde_db'
    }
    
    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/mordecai2508/spde-gr.git'
            }
        }
        
        stage('Install dependencies') {
            steps {
                dir('backend') {
                    echo 'Instalando dependencias del backend...'
                    sh 'npm install'
                }
            }
        }
        
        stage('Test') {
            steps {
                dir('backend') {
                    echo 'Ejecutando pruebas del backend...'
                    sh '''
                        export NODE_ENV=test
                        export DB_HOST=host.docker.internal
                        npm test
                    '''
                }
            }
        }
        
        stage('Package') {
            steps {
                dir('backend') {
                    echo 'Empaquetando aplicación...'
                    sh '''
                        tar -czf backend.tar.gz \
                            --exclude=node_modules \
                            --exclude=.git \
                            --exclude=*.tar.gz \
                            .
                        echo "✓ Paquete creado: backend.tar.gz"
                        ls -lh backend.tar.gz
                    '''
                }
            }
        }
        
        stage('Deploy (Simulado)') {
            steps {
                echo '🚀 Desplegando aplicación (simulado)...'
                echo '✓ Deployment exitoso!'
            }
        }
    }
    
    post {
        success {
            echo '✅ Pipeline completado exitosamente!'
        }
        failure {
            echo '❌ Pipeline falló. Revisa las etapas anteriores.'
        }
    }
}
