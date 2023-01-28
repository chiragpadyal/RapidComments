export const getComments = async () => {
    return [
      {
        id: "1",
        body: "First comment",
        username: "Anuj",
        userId: "1",
        parentId: null,
        createdAt: "2023-01-28T23:00:33.010+02:00",
      },
      {
        id: "2",
        body: "Second comment",
        username: "Vish",
        userId: "2",
        parentId: null,
        createdAt: "2023-01-28T23:00:33.010+02:00",
      },
      {
        id: "3",
        body: "First comment first child",
        username: "Vish",
        userId: "2",
        parentId: "1",
        createdAt: "2023-01-28T23:00:33.010+02:00",
      },
      {
        id: "4",
        body: "Second comment second child",
        username: "Vish",
        userId: "2",
        parentId: "2",
        createdAt: "2023-01-28T23:00:33.010+02:00",
      },
    ];
  };
  
  export const createComment = async (text, parentId = null) => {
    return {
      id: Math.random().toString(36).substr(2, 9),
      body: text,
      parentId,
      userId: "1",
      username: "Vish",
      createdAt: new Date().toISOString(),
    };
  };
  
  export const updateComment = async (text) => {
    return { text };
  };
  
  export const deleteComment = async () => {
    return {};
  };