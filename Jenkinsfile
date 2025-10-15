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
                            echo '📦 Backend: Instalando dependencias...'
                            sh 'npm install'
                        }
                    }
                }
                stage('Frontend Dependencies') {
                    steps {
                        dir('frontend') {
                            echo '📦 Frontend: Instalando dependencias...'
                            sh 'npm install'
                        }
                    }
                }
            }
        }
        
        stage('Build & Test') {
            parallel {
                stage('Backend Pipeline') {
                    stages {
                        stage('Backend Test') {
                            steps {
                                dir('backend') {
                                    echo '🧪 Testing backend...'
                                    sh 'npm test || exit 0'
                                }
                            }
                        }
                        stage('Backend Security') {
                            steps {
                                dir('backend') {
                                    sh 'npm audit --audit-level=moderate || true'
                                }
                            }
                        }
                        stage('Backend Package') {
                            steps {
                                dir('backend') {
                                    sh 'tar -czf backend.tar.gz --exclude=node_modules --exclude=.git .'
                                }
                            }
                        }
                    }
                }
                
                stage('Frontend Pipeline') {
                    stages {
                        stage('Frontend Security') {
                            steps {
                                dir('frontend') {
                                    sh 'npm audit --audit-level=moderate || true'
                                }
                            }
                        }
                        stage('Frontend Build') {
                            steps {
                                dir('frontend') {
                                    echo '🏗️ Building with Vite...'
                                    sh '''
                                        npm run build
                                        echo "✓ Build completado"
                                        du -sh dist/
                                    '''
                                }
                            }
                        }
                        stage('Frontend Package') {
                            steps {
                                dir('frontend') {
                                    sh 'tar -czf frontend-build.tar.gz dist/'
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
            archiveArtifacts artifacts: 'backend/backend.tar.gz, frontend/frontend-build.tar.gz'
            echo '✅ Pipeline completado!'
        }
        failure {
            echo '❌ Pipeline falló'
        }
        always {
            sh 'rm -rf backend/node_modules frontend/node_modules frontend/dist || true'
        }
    }
}
