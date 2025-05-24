export const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "TCE-Life API",
    description: "API do sistema TCE-Life para gestão médica",
    version: "1.0.0"
  },
  servers: [
    {
      url: "http://localhost:3000/api",
      description: "Servidor de desenvolvimento"
    }
  ],
  paths: {
    "/patients": {
      get: {
        tags: ["Patients"],
        summary: "Lista todos os pacientes",
        responses: {
          "200": {
            description: "Lista de pacientes",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/Patient"
                  }
                }
              }
            }
          }
        }
      },
      post: {
        tags: ["Patients"],
        summary: "Cria um novo paciente",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/PatientInput"
              }
            }
          }
        },
        responses: {
          "201": {
            description: "Paciente criado com sucesso",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Patient"
                }
              }
            }
          }
        }
      }
    },
    "/attendances": {
      get: {
        tags: ["Attendances"],
        summary: "Lista todos os atendimentos",
        responses: {
          "200": {
            description: "Lista de atendimentos",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/Attendance"
                  }
                }
              }
            }
          }
        }
      },
      post: {
        tags: ["Attendances"],
        summary: "Cria um novo atendimento",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/AttendanceInput"
              }
            }
          }
        },
        responses: {
          "201": {
            description: "Atendimento criado com sucesso",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Attendance"
                }
              }
            }
          }
        }
      }
    }
  },
  components: {
    schemas: {
      Patient: {
        type: "object",
        properties: {
          id: {
            type: "string",
            format: "uuid"
          },
          name: {
            type: "string"
          },
          dateOfBirth: {
            type: "string",
            format: "date-time"
          },
          gender: {
            type: "string"
          },
          insurance: {
            type: "string"
          },
          createdAt: {
            type: "string",
            format: "date-time"
          },
          updatedAt: {
            type: "string",
            format: "date-time"
          }
        }
      },
      PatientInput: {
        type: "object",
        required: ["name", "dateOfBirth", "gender"],
        properties: {
          name: {
            type: "string"
          },
          dateOfBirth: {
            type: "string",
            format: "date-time"
          },
          gender: {
            type: "string"
          },
          insurance: {
            type: "string"
          }
        }
      },
      Attendance: {
        type: "object",
        properties: {
          id: {
            type: "string",
            format: "uuid"
          },
          patientId: {
            type: "string",
            format: "uuid"
          },
          date: {
            type: "string",
            format: "date-time"
          },
          vitalSigns: {
            type: "object"
          },
          anamnesis: {
            type: "string"
          },
          diagnosis: {
            type: "string"
          },
          observations: {
            type: "string"
          },
          createdAt: {
            type: "string",
            format: "date-time"
          },
          updatedAt: {
            type: "string",
            format: "date-time"
          }
        }
      },
      AttendanceInput: {
        type: "object",
        required: ["patientId", "anamnesis"],
        properties: {
          patientId: {
            type: "string",
            format: "uuid"
          },
          vitalSigns: {
            type: "object"
          },
          anamnesis: {
            type: "string"
          },
          diagnosis: {
            type: "string"
          },
          observations: {
            type: "string"
          }
        }
      }
    }
  }
}; 