// Job: athena/frontend/EduLog-AthenaUI-v1_2
pipeline {
  agent any

  environment {
    FE_DOMAIN = 'karrostech.io'
  }

  stages {
    stage('Build') {
      steps {
        echo "=> Install prerequisite packages "
        sh 'npm install > /dev/null'
        sh 'npm run build'
      }
    }
    stage('Deploy to Stage Environment') {
      when { branch 'main' }
      environment { 
        DOMAIN = "hermes.${FE_DOMAIN}" 
      }
      steps {
        echo "=> Deploy $DOMAIN"
        dir('dist/Hermes') {
          echo "==> Remove files on s3://${DOMAIN}"
          sh '''#!/bin/bash -xe
            aws s3 rm s3://${DOMAIN} --recursive
          '''
          echo "==> Upload files to s3://${DOMAIN}"
          sh '''#!/bin/bash -xe
            aws s3 cp --acl public-read --recursive . s3://${DOMAIN}/
          '''
          echo "==> Invalidate Cloudfront"
          sh '''#!/bin/bash -xe
            aws cloudfront create-invalidation --distribution-id E20IVNDDUG4RWU --paths \"/*\"
          '''
        }
      }
    }
  }
  post {
    always {
      echo "=> Clean Workspace after run"
      cleanWs()
    }
    success {
      echo "=> Build Success"
    }
    failure {
      echo "=> Build Failure"
    }
  }
}