pipeline {
  agent any
  stages {
    stage('Checkout Code') {
      steps {
        git(url: 'https://github.com/pranavk1511/Jenkins-Setup', branch: 'main')
      }
    }

    stage('Log') {
      steps {
        sh 'ls -la'
      }
    }

    stage('Build Docker') {
      steps {
        sh 'docker build -f curriculum-front/Dockerfile . '
      }
    }

  }
}