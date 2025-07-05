"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  User,
  UserPlus,
  Trash2,
  Search,
  Shield,
  Edit2,
  Check,
  X,
} from "lucide-react";
import ContentLayout from "@/components/features/hire/content-layout";

interface UserData {
  id: number;
  name: string;
  email: string;
  role: string;
  dateAdded: string;
  status: string;
}

export default function AddUsers() {
  const router = useRouter();
  const [users, setUsers] = useState<UserData[]>([
    {
      id: 1,
      name: "John Smith",
      email: "john.smith@google.com",
      role: "Admin",
      dateAdded: "May 15, 2025",
      status: "Active",
    },
    {
      id: 2,
      name: "Sarah Johnson",
      email: "sarah.j@google.com",
      role: "Recruiter",
      dateAdded: "May 10, 2025",
      status: "Active",
    },
    {
      id: 3,
      name: "Michael Chen",
      email: "m.chen@google.com",
      role: "Recruiter",
      dateAdded: "May 5, 2025",
      status: "Active",
    },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingUser, setEditingUser] = useState<Partial<UserData>>({});

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "Recruiter",
  });

  const handleInviteUser = () => {
    if (newUser.name && newUser.email) {
      const user: UserData = {
        id: users.length + 1,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        dateAdded: new Date().toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        }),
        status: "Active",
      };
      setUsers([...users, user]);
      setNewUser({ name: "", email: "", role: "Recruiter" });
      setShowAddForm(false);
    }
  };

  const handleDeleteUser = (id: number) => {
    setUsers(users.filter((user) => user.id !== id));
  };

  const handleEditUser = (user: UserData) => {
    setEditingId(user.id);
    setEditingUser({ ...user });
  };

  const handleSaveEdit = () => {
    setUsers(
      users.map((user) =>
        user.id === editingId ? ({ ...user, ...editingUser } as UserData) : user
      )
    );
    setEditingId(null);
    setEditingUser({});
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingUser({});
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ContentLayout>
      <div className="h-screen w-full bg-white flex">
        <div className="flex-1 flex flex-col">
          <div className="flex-1 p-6 overflow-hidden flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <div className="relative w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search users by name or email..."
                  className="pl-10"
                />
              </div>
              <Button onClick={() => setShowAddForm(true)}>
                <UserPlus className="h-4 w-4 mr-2" />
                Add Account
              </Button>
            </div>
            {showAddForm && (
              <div className="mb-6 p-6 bg-gray-50 border-2 border-gray-200 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Add New User</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="new-name">Name</Label>
                    <Input
                      id="new-name"
                      value={newUser.name}
                      onChange={(e) =>
                        setNewUser({ ...newUser, name: e.target.value })
                      }
                      placeholder="Enter full name"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="new-email">Email</Label>
                    <Input
                      id="new-email"
                      type="email"
                      value={newUser.email}
                      onChange={(e) =>
                        setNewUser({ ...newUser, email: e.target.value })
                      }
                      placeholder="user@company.com"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="new-role">Role</Label>
                    <select
                      id="new-role"
                      value={newUser.role}
                      onChange={(e) =>
                        setNewUser({ ...newUser, role: e.target.value })
                      }
                      className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <option value="Admin">Admin</option>
                      <option value="Recruiter">Recruiter</option>
                      <option value="Viewer">Viewer</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowAddForm(false);
                      setNewUser({ name: "", email: "", role: "Recruiter" });
                    }}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleInviteUser}>Invite User</Button>
                </div>
              </div>
            )}

            {/* Users Table */}
            <div className="flex-1 bg-white border-2 border-gray-200 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left p-4 font-semibold text-gray-800">
                        Name
                      </th>
                      <th className="text-left p-4 font-semibold text-gray-800">
                        Email
                      </th>
                      <th className="text-left p-4 font-semibold text-gray-800">
                        Role
                      </th>
                      <th className="text-left p-4 font-semibold text-gray-800">
                        Date Added
                      </th>
                      <th className="text-left p-4 font-semibold text-gray-800">
                        Status
                      </th>
                      <th className="text-left p-4 font-semibold text-gray-800">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="p-4">
                          {editingId === user.id ? (
                            <Input
                              value={editingUser.name}
                              onChange={(e) =>
                                setEditingUser({
                                  ...editingUser,
                                  name: e.target.value,
                                })
                              }
                              className="w-full"
                            />
                          ) : (
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <User className="h-4 w-4 text-blue-600" />
                              </div>
                              <span className="font-medium text-gray-900">
                                {user.name}
                              </span>
                            </div>
                          )}
                        </td>
                        <td className="p-4">
                          {editingId === user.id ? (
                            <Input
                              type="email"
                              value={editingUser.email}
                              onChange={(e) =>
                                setEditingUser({
                                  ...editingUser,
                                  email: e.target.value,
                                })
                              }
                              className="w-full"
                            />
                          ) : (
                            <span className="text-gray-600">{user.email}</span>
                          )}
                        </td>
                        <td className="p-4">
                          {editingId === user.id ? (
                            <select
                              value={editingUser.role}
                              onChange={(e) =>
                                setEditingUser({
                                  ...editingUser,
                                  role: e.target.value,
                                })
                              }
                              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            >
                              <option value="Admin">Admin</option>
                              <option value="Recruiter">Recruiter</option>
                              <option value="Viewer">Viewer</option>
                            </select>
                          ) : (
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                                user.role === "Admin"
                                  ? "bg-purple-100 text-purple-700"
                                  : user.role === "Recruiter"
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              <Shield className="h-3 w-3" />
                              {user.role}
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-gray-600">{user.dateAdded}</td>
                        <td className="p-4">
                          <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                            {user.status}
                          </span>
                        </td>
                        <td className="p-4">
                          {editingId === user.id ? (
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={handleSaveEdit}
                                className="h-8 w-8 p-0"
                              >
                                <Check className="h-4 w-4 text-green-600" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={handleCancelEdit}
                                className="h-8 w-8 p-0"
                              >
                                <X className="h-4 w-4 text-red-600" />
                              </Button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditUser(user)}
                                className="h-8 w-8 p-0"
                              >
                                <Edit2 className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteUser(user.id)}
                                className="h-8 w-8 p-0 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4 text-red-600" />
                              </Button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* User Count */}
            <div className="mt-4 text-sm text-gray-600">
              Showing {filteredUsers.length} of {users.length} users
            </div>
          </div>
        </div>
      </div>
    </ContentLayout>
  );
}
