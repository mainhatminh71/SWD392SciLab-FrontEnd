"use client";

import { useState } from "react";
import {
  Users,
  Search,
  ChevronDown,
  MoreHorizontal,
  UserCheck,
  UserX,
  UserCog,
  Trash2,
  CheckCircle,
  XCircle,
} from "lucide-react";
import AdminShell from "@/shared/components/layout/AdminShell";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Card } from "@/shared/components/ui/card";
import { Label } from "@/shared/components/ui/label";
import { mockUsers } from "@/features/users/api/mockUsers";
import type { User } from "@/features/users/types/user.types";

interface UserManagementProps {
  onNavigate?: (view: string) => void;
}

export default function UserManagement({ onNavigate }: UserManagementProps) {
  const [users, setUsers] = useState(mockUsers);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null);

  const handleActivateUser = (userId: string) => {
    setUsers(
      users.map((user) =>
        user.id === userId ? { ...user, status: "active" as const } : user
      )
    );
    setShowActionMenu(null);
  };

  const handleDeactivateUser = (userId: string) => {
    setUsers(
      users.map((user) =>
        user.id === userId ? { ...user, status: "inactive" as const } : user
      )
    );
    setShowActionMenu(null);
  };

  const handleSuspendUser = (userId: string) => {
    setUsers(
      users.map((user) =>
        user.id === userId ? { ...user, status: "suspended" as const } : user
      )
    );
    setShowActionMenu(null);
  };

  const handleChangeRole = (userId: string, newRole: "admin" | "researcher" | "reader") => {
    setUsers(
      users.map((user) => (user.id === userId ? { ...user, role: newRole } : user))
    );
  };

  const handleDeleteUser = (userId: string) => {
    if (window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      setUsers(users.filter((user) => user.id !== userId));
      setShowActionMenu(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const configs = {
      active: { bg: "bg-green-100", text: "text-green-700", border: "border-green-200" },
      inactive: { bg: "bg-gray-100", text: "text-gray-700", border: "border-gray-200" },
      suspended: { bg: "bg-red-100", text: "text-red-700", border: "border-red-200" },
    };
    const config = configs[status as keyof typeof configs];
    return (
      <span
        className={`px-2.5 py-1 ${config.bg} ${config.text} text-xs font-semibold rounded border ${config.border}`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getRoleBadge = (role: string) => {
    const configs = {
      admin: { bg: "bg-purple-100", text: "text-purple-700", border: "border-purple-200" },
      researcher: { bg: "bg-blue-100", text: "text-blue-700", border: "border-blue-200" },
      reader: { bg: "bg-gray-100", text: "text-gray-700", border: "border-gray-200" },
    };
    const config = configs[role as keyof typeof configs];
    return (
      <span
        className={`px-2.5 py-1 ${config.bg} ${config.text} text-xs font-semibold rounded border ${config.border}`}
      >
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch = searchQuery
      ? user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.displayName.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const activeFilterCount = (roleFilter !== "all" ? 1 : 0) + (statusFilter !== "all" ? 1 : 0);

  return (
    <AdminShell
      title="User Management"
      subtitle={`${filteredUsers.length} users`}
      icon={<Users className="w-5 h-5 text-white" strokeWidth={2.5} />}
    >
      <div className="max-w-[1600px] mx-auto space-y-6">
            {/* Search and Filters */}
            <Card className="p-6 border-gray-200 bg-white">
              <div className="flex items-center gap-4">
                {/* Search */}
                <div className="flex-1 max-w-md">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      type="search"
                      placeholder="Search by email or name..."
                      className="pl-10 h-11 bg-white border-gray-200 shadow-sm"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                {/* Role Filter */}
                <div className="w-48">
                  <div className="relative">
                    <select
                      className="w-full h-11 px-4 pr-8 bg-white border border-gray-200 rounded-lg text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm"
                      value={roleFilter}
                      onChange={(e) => setRoleFilter(e.target.value)}
                    >
                      <option value="all">All Roles</option>
                      <option value="admin">Admin</option>
                      <option value="researcher">Researcher</option>
                      <option value="reader">Reader</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Status Filter */}
                <div className="w-48">
                  <div className="relative">
                    <select
                      className="w-full h-11 px-4 pr-8 bg-white border border-gray-200 rounded-lg text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option value="all">All Status</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="suspended">Suspended</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {activeFilterCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setRoleFilter("all");
                      setStatusFilter("all");
                    }}
                    className="h-11"
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
            </Card>

            {/* Users Table */}
            <Card className="border-gray-200 bg-white overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 bg-slate-50">
                      <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        User
                      </th>
                      <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Registration Date
                      </th>
                      <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Last Login
                      </th>
                      <th className="text-right py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredUsers.map((user) => (
                      <tr
                        key={user.id}
                        className="hover:bg-slate-50 transition-colors"
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-white text-sm font-medium">
                                {user.displayName.charAt(0)}
                              </span>
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {user.displayName}
                              </p>
                              <p className="text-sm text-gray-500 truncate">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">{getRoleBadge(user.role)}</td>
                        <td className="py-4 px-6">{getStatusBadge(user.status)}</td>
                        <td className="py-4 px-6">
                          <span className="text-sm text-gray-600">
                            {formatDate(user.registrationDate)}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className="text-sm text-gray-600">
                            {user.lastLogin ? formatDate(user.lastLogin) : "Never"}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center justify-end gap-2">
                            {/* Quick Actions */}
                            {user.status === "active" ? (
                              <button
                                onClick={() => handleDeactivateUser(user.id)}
                                className="p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                                title="Deactivate"
                              >
                                <UserX className="w-4 h-4" />
                              </button>
                            ) : (
                              <button
                                onClick={() => handleActivateUser(user.id)}
                                className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                title="Activate"
                              >
                                <UserCheck className="w-4 h-4" />
                              </button>
                            )}

                            {/* More Actions Menu */}
                            <div className="relative">
                              <button
                                onClick={() =>
                                  setShowActionMenu(
                                    showActionMenu === user.id ? null : user.id
                                  )
                                }
                                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                              >
                                <MoreHorizontal className="w-4 h-4" />
                              </button>

                              {showActionMenu === user.id && (
                                <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                                  <div className="py-1">
                                    <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                                      Change Role
                                    </div>
                                    <button
                                      onClick={() => handleChangeRole(user.id, "admin")}
                                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors"
                                      disabled={user.role === "admin"}
                                    >
                                      Admin
                                    </button>
                                    <button
                                      onClick={() => handleChangeRole(user.id, "researcher")}
                                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                                      disabled={user.role === "researcher"}
                                    >
                                      Researcher
                                    </button>
                                    <button
                                      onClick={() => handleChangeRole(user.id, "reader")}
                                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-700 transition-colors"
                                      disabled={user.role === "reader"}
                                    >
                                      Reader
                                    </button>

                                    <div className="border-t border-gray-100 mt-1"></div>

                                    {user.status !== "suspended" && (
                                      <button
                                        onClick={() => handleSuspendUser(user.id)}
                                        className="w-full px-4 py-2 text-left text-sm text-orange-600 hover:bg-orange-50 transition-colors flex items-center gap-2"
                                      >
                                        <XCircle className="w-4 h-4" />
                                        Suspend User
                                      </button>
                                    )}

                                    <button
                                      onClick={() => handleDeleteUser(user.id)}
                                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                      Delete User
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {filteredUsers.length === 0 && (
                  <div className="py-12 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No users found</h3>
                    <p className="text-sm text-gray-600">
                      Try adjusting your search or filters.
                    </p>
                  </div>
                )}
              </div>
            </Card>

            {/* Stats Cards */}
            <div className="grid grid-cols-4 gap-6">
              <Card className="p-6 border-gray-200 bg-white">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-600">Total Users</p>
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-900">{users.length}</p>
              </Card>

              <Card className="p-6 border-gray-200 bg-white">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-600">Active Users</p>
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-900">
                  {users.filter((u) => u.status === "active").length}
                </p>
              </Card>

              <Card className="p-6 border-gray-200 bg-white">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-600">Researchers</p>
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <UserCog className="w-5 h-5 text-purple-600" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-900">
                  {users.filter((u) => u.role === "researcher").length}
                </p>
              </Card>

              <Card className="p-6 border-gray-200 bg-white">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-600">Suspended</p>
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <XCircle className="w-5 h-5 text-red-600" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-900">
                  {users.filter((u) => u.status === "suspended").length}
                </p>
              </Card>
            </div>
          </div>
    </AdminShell>
  );
}
