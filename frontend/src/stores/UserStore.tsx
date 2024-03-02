import { create } from "zustand";
import { User } from "@/interfaces/user";
import { fetchFromPromptdesk } from "@/services/PromptdeskService";

interface IUserStore {
  users: User[];
  fetchUsers: () => Promise<User[]>;
  createUser: (email: string, password: string) => void;
  deleteUser: (email: string) => void;
  resetPassword: (email: string) => Promise<any>;
}

const userStore = create<IUserStore>((set) => {
  const fetchUsers = async () => {
    const usersForOrg = await fetchFromPromptdesk("/users");
    set({ users: usersForOrg.users });
    return usersForOrg;
  };
  return {
    users: [],
    fetchUsers,
    createUser: async (email: string, password: string) => {
      await fetchFromPromptdesk("/users", "POST", { email, password });
      fetchUsers();
    },
    deleteUser: async (email: string) => {
      await fetchFromPromptdesk("/users", "DELETE", { email });
      fetchUsers();
    },
    resetPassword: async (email: string) => {
      const data = await fetchFromPromptdesk("/users/reset", "POST", { email });
      return data;
    },
  };
});

export { userStore };
