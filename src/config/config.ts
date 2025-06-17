//const BASE_URL = "https://127.0.0.1:8000/";
const BASE_URL = "https://taskmanagementfast-production.up.railway.app/";
export const config = {
  api: {
    baseUrl: BASE_URL,
    auth: {
      login: `${BASE_URL}auth/login`,
      register: `${BASE_URL}users/CreateNewUser`,
      currentUser: `${BASE_URL}auth/current_user`,
    },
    tasks: {
      all: `${BASE_URL}tasks/getAllTasks`,
      byId: (task_id: string) => `${BASE_URL}tasks/getTaskById/${task_id}`,
      create: `${BASE_URL}tasks/createNewTask`,
      update: (task_id: string) => `${BASE_URL}tasks/updateTaskById/${task_id}`,
      delete: (task_id: string) => `${BASE_URL}tasks/deleteTaskById/${task_id}`,
    },
    projectService: {
      createProject: `${BASE_URL}projects/createProject`,
      getAllProject: `${BASE_URL}projects/getAllProject`,
      getPorjectById:(project_id: number)=> `${BASE_URL}projects/getProjectByID/${project_id}`,
      updateProject: (project_id: number) => `${BASE_URL}projects/updateProjectByID/${project_id}`,
      deleteProject: (project_id: number) => `${BASE_URL}projects/deleteProjectByID/${project_id}`
    },
    userService:{
      getAllUsers: `${BASE_URL}users/getAllUsers`,
      getUserById: (user_id: string) => `${BASE_URL}users/getUserById/${user_id}`,
      createUser: `${BASE_URL}users/createNewUser`,
      updateUser: (user_id: string) => `${BASE_URL}users/updateUserById/${user_id}`,
    }
  },
};