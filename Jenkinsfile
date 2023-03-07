String DOCKER_REGISTRY="registry.hub.docker.com"
String DOCKER_REPOSITORY="psycholog1st/la-peche-api"
String DOCKER_IMAGE="${DOCKER_REGISTRY}/${DOCKER_REPOSITORY}"
String DOCKER_TAG_BUILD="0.2-${env.BUILD_NUMBER}"

pipeline {
  agent any
  options {
	  ansiColor('xterm')
    disableConcurrentBuilds()
  }

  environment {
    TIMESTAMP = """${sh(
      returnStdout: true,
      script: 'date --utc +%Y%m%d_%H%M%SZ'
      ).trim()}"""
    JWT_SECRET = credentials('JWT_SECRET')
    MAIL_USERNAME = credentials('MAIL_USERNAME')
    MAIL_PASSWORD = credentials('MAIL_PASSWORD')
    MAIL_HOST = credentials('MAIL_HOST')
    MAIL_FROM = credentials('MAIL_FROM')
    DOCKER_USERNAME = credentials('DOCKER_USERNAME')
    DOCKER_PASSWORD = credentials('DOCKER_PASSWORD')
  }

  parameters {
    string (name: "gitBranch", defaultValue: "main", description: "Branch to build")
  }

  triggers {
    GenericTrigger(
      genericVariables: [
        [key: 'gitBranch', value: '$.ref'],
        [key: 'git_sha', value: '$.after'],
        //[key: 'changed_files', value: '$.commits[*].["modified","added","removed"][*]']
      ],

      causeString: 'Triggered on $gitBranch',

      token: "api-build",

      printContributedVariables: true,
      printPostContent: true,

      silentResponse: false,

      regexpFilterText: '$gitBranch',
      regexpFilterExpression: '^refs/heads/main'
      )
  }

  stages {
    stage('Checkout') {
      steps {
        checkout ( [$class: 'GitSCM',
          extensions: [[$class: 'CloneOption', timeout: 30]],
          branches: [[name: "${gitBranch}" ]],
          userRemoteConfigs: [[
            url: "git@github.com:letronghoangminh/la-peche-api.git"]]])
      }
    }

	  stage('Build') { 
	    steps {
        sh """
            cp .env.example .env

            sed -i "/^APP_ENV=/c APP_ENV=production" .env
            sed -i "/^ROOT_API=/c ROOT_API=https://lapeche.date/api" .env
            sed -i "/^MAIL_FROM=/c MAIL_FROM=${MAIL_FROM}" .env
            sed -i "/^MAIL_USERNAME=/c MAIL_USERNAME=${MAIL_USERNAME}" .env
            sed -i "/^MAIL_PASSWORD=/c MAIL_PASSWORD=${MAIL_PASSWORD}" .env
            sed -i "/^MAIL_HOST=/c MAIL_HOST=${MAIL_HOST}" .env
            sed -i "/^JWT_SECRET=/c JWT_SECRET=${JWT_SECRET}" .env

            docker login ${DOCKER_REGISTRY} --username ${DOCKER_USERNAME} --password ${DOCKER_PASSWORD}
            docker build -t ${DOCKER_IMAGE}:${DOCKER_TAG_BUILD} -t ${DOCKER_IMAGE}:latest .
            docker push ${DOCKER_IMAGE}:${DOCKER_TAG_BUILD}
            docker push ${DOCKER_IMAGE}:latest
        """
      }
	  }

    stage('Deploy') {
      steps {
        sh """
          docker service update --image=${DOCKER_IMAGE}:${DOCKER_TAG_BUILD} lapeche_api
        """
      }
    }
  }

  post {
    always {
      cleanWs()
    }
  } 
}
