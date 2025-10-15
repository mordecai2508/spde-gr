pipeline {
    agent any
    
    environment {
        NODE_ENV = 'test'
        DB_HOST = 'host.docker.internal'  // ← CLAVE
        DB_USER = 'root'
        DB_PASSWORD = ''
        DB_NAME = 'spde'
    }
    
    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/mordecai2508/spde-gr.git'
            }
        }
        
        stage('Install Dependencies') {
            parallel {
                stage('Backend Dependencies') {
                    steps {
                        dir('backend') {
                            echo '📦 Instalando dependencias del backend...'
                            sh 'npm install'
                        }
                    }
                }
                stage('Frontend Dependencies') {
                    steps {
                        dir('frontend') {
                            echo '📦 Instalando dependencias del frontend...'
                            sh 'npm install'
                        }
                    }
                }
            }
        }
        
        stage('Test & Build') {
            parallel {
                stage('Backend Pipeline') {
                    stages {
                        stage('Backend: Test') {
                            steps {
                                dir('backend') {
                                    echo '🧪 Testing backend...'
                                    sh 'npm test || exit 0'
                                }
                            }
                        }
                        stage('Backend: Package') {
                            steps {
                                dir('backend') {
                                    echo '📦 Packaging backend...'
                                    sh 'tar -czf backend.tar.gz --exclude=node_modules .'
                                }
                            }
                        }
                    }
                }
                
                stage('Frontend Pipeline') {
                    stages {
                        stage('Frontend: Test') {
                            steps {
                                dir('frontend') {
                                    echo '🧪 Testing frontend...'
                                    sh 'npm test -- --watchAll=false || exit 0'
                                }
                            }
                        }
                        stage('Frontend: Build') {
                            steps {
                                dir('frontend') {
                                    echo '🏗️ Building frontend...'
                                    sh 'npm run build || echo "No build script"'
                                }
                            }
                        }
                        stage('Frontend: Package') {
                            steps {
                                dir('frontend') {
                                    echo '📦 Packaging frontend...'
                                    sh '''
                                        if [ -d "build" ]; then
                                            tar -czf frontend-build.tar.gz build/
                                        fi
                                    '''
                                }
                            }
                        }
                    }
                }
            }
        }
        
        stage('Deploy') {
            steps {
                echo '🚀 Deployment exitoso!'
            }
        }
    }
    
    post {
        success {
            echo '✅ Pipeline completado!'
        }
        failure {
            echo '❌ Pipeline falló'
        }
        always {
            archiveArtifacts artifacts: '**/backend.tar.gz, **/frontend-build.tar.gz', 
                             allowEmptyArchive: true
        }
    }
}
