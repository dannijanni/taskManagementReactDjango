// const BASE_URL = "http://127.0.0.1:8000/";
// //const BASE_URL = "https://taskmanagementfast-production.up.railway.app/";
// export const config = {
//   api: {
//     baseUrl: BASE_URL,
//     auth: {
//       login: `${BASE_URL}auth/login`,
//       register: `${BASE_URL}users/CreateNewUser`,
//       currentUser: `${BASE_URL}auth/current_user`,
//     },
//     tasks: {
//       all: `${BASE_URL}tasks/getAllTasks`,
//       byId: (task_id: string) => `${BASE_URL}tasks/getTaskById/${task_id}`,
//       create: `${BASE_URL}tasks/createNewTask`,
//       update: (task_id: string) => `${BASE_URL}tasks/updateTaskById/${task_id}`,
//       delete: (task_id: string) => `${BASE_URL}tasks/deleteTaskById/${task_id}`,
//     },
//     projectService: {
//       createProject: `${BASE_URL}projects/createProject`,
//       getAllProject: `${BASE_URL}projects/getAllProject`,
//       getPorjectById:(project_id: number)=> `${BASE_URL}projects/getProjectByID/${project_id}`,
//       updateProject: (project_id: number) => `${BASE_URL}projects/updateProjectByID/${project_id}`,
//       deleteProject: (project_id: number) => `${BASE_URL}projects/deleteProjectByID/${project_id}`
//     },
//     userService:{
//       getAllUsers: `${BASE_URL}users/getAllUsers`,
//       getUserById: (user_id: string) => `${BASE_URL}users/getUserById/${user_id}`,
//       createUser: `${BASE_URL}users/createNewUser`,
//       updateUser: (user_id: string) => `${BASE_URL}users/updateUserById/${user_id}`,
//     }
//   },
// };


// const BASE_URL = "http://127.0.0.1:8000/"; // Django base URL
 const BASE_URL = "https://clever-creation-production-0526.up.railway.app/"; // Django base URL


export const config = {
  api: {
    baseUrl: BASE_URL,
    auth: {
      login: `${BASE_URL}login/`,
      register: `${BASE_URL}create-user/`, // or create_user if you change the name
      currentUser: `${BASE_URL}auth/current_user`, // Optional if implemented in Django
    },
    tasks: {
      all: `${BASE_URL}tasks/`,
      //byId: (task_id: string) => `${BASE_URL}tasks/${task_id}/`,
      create: `${BASE_URL}tasks/create/`,
      //update: (task_id: number) => `${BASE_URL}tasks/${task_id}/update/`,
      //delete: (task_id: number) => `${BASE_URL}tasks/${task_id}/delete/`,
      byId: (task_id: string) => `${BASE_URL}tasks/${task_id}/`,
      update: (task_id: string) => `${BASE_URL}tasks/${task_id}/update/`,
      delete: (task_id: string) => `${BASE_URL}tasks/${task_id}/delete/`,
    },
    projectService: {
      createProject: `${BASE_URL}projects/create/`,
      getAllProject: `${BASE_URL}projects/`,
      getPorjectById: (project_id: number) => `${BASE_URL}projects/${project_id}/`,
      updateProject: (project_id: number) => `${BASE_URL}projects/${project_id}/update/`,
      deleteProject: (project_id: number) => `${BASE_URL}projects/${project_id}/delete/`,
    },
    userService: {
      getAllUsers: `${BASE_URL}users/`,
      getUserById: (user_id: string) => `${BASE_URL}users/${user_id}/`,
      createUser: `${BASE_URL}create-user/`,
      updateUser: (user_id: string) => `${BASE_URL}users/${user_id}/`, // handled by PUT in same endpoint
    },
    roleService: {
      getAllRoles: `${BASE_URL}roles/`,
      getRoleById: (role_id: string) => `${BASE_URL}roles/${role_id}/`,
      createRole: `${BASE_URL}roles/create/`,
      updateRole: (role_id: string) => `${BASE_URL}roles/${role_id}/update/`,
      deleteRole: (role_id: string) => `${BASE_URL}roles/${role_id}/delete/`,
    },
  },
};
