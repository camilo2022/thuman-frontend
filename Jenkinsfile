@Library('pipeline-lib@feature/refactorizacion-v2') _

pipeline {
  agent any

  options {
    timestamps()
    ansiColor('xterm')
    skipDefaultCheckout()
    disableConcurrentBuilds()
  }

  parameters {
    booleanParam(
      name: 'ROLLBACK',
      defaultValue: false,
      description: 'Si es true, ejecuta rollback en vez de deploy normal'
    )
    string(
      name: 'ROLLBACK_TAG',
      defaultValue: '',
      description: 'Tag a usar en rollback. Vacío = latest.json'
    )
  }

  stages {
    stage('CI/CD') {
      steps {
        script {
          // ✅ Orquestador principal de tu lib
          stackCICD(
            // Managed Files (Jenkins Config File Provider)
            pipelineConfigFileId      : 'pipeline-transformacion_digital-recursos_humanos-frontend.yaml', // <-- tu YAML de app

            // Params (rollback)
            rollback: params.ROLLBACK,
            rollbackTag: params.ROLLBACK_TAG
          )
        }
      }
    }
  }

  post {
    always {
      echo "Build finalizado: ${currentBuild.currentResult}"
    }
  }
}
