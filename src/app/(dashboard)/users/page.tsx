import { adminStore } from "@/infrastructure/persistence/store";
import { UsersClient } from "./UsersClient";

export default function UsersPage() {
  const users = adminStore.getUsers();
  return <UsersClient users={users} />;
}
