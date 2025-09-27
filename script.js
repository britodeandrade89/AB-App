// Esquema do banco de dados para referência
export const DatabaseSchema = {
  users: [
    {
      id: 'number',
      name: 'string',
      email: 'string',
      photo: 'string',
      createdAt: 'timestamp'
    }
  ],
  trainingPlans: {
    '[email]': {
      'A': [
        {
          name: 'string',
          img: 'string',
          details: 'string',
          carga: 'number',
          cargaHistoria: 'array',
          completed: 'boolean'
        }
      ],
      'B': 'array',
      'runningLog': 'object',
      'weightLog': 'array',
      'periodizacao': 'array',
      'attendance': 'object'
    }
  },
  outdoorWorkouts: [
    {
      id: 'number',
      userId: 'string',
      activity: 'string',
      startTime: 'timestamp',
      endTime: 'timestamp',
      distance: 'number',
      duration: 'number',
      trackPoints: 'array',
      photo: 'string?'
    }
  ],
  physioAssessments: [
    {
      id: 'string',
      alunoId: 'string',
      data: 'timestamp',
      peso: 'number',
      altura: 'number',
      // ... outros campos de avaliação
    }
  ]
};

// Funções de validação
export const validateUser = (user) => {
  const required = ['id', 'name', 'email'];
  return required.every(field => user[field]);
};

export const validateWorkout = (workout) => {
  const required = ['id', 'activity', 'startTime', 'distance'];
  return required.every(field => workout[field]);
};
