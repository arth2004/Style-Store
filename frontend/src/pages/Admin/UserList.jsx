import { useEffect, useState } from "react";
import {
  useDeleteUserMutation,
  useGetUsersQuery,
  useUpdateUserMutation,
} from "../../redux/api/usersApiSlice";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import {
  FaCheck,
  FaEdit,
  FaTimes,
  FaTrash,
  FaUsers,
  FaUserShield,
  FaUser,
  FaEnvelope,
  FaCrown,
  FaUserEdit,
  FaExclamationTriangle,
} from "react-icons/fa";
import AdminMenu from "./AdminMenu";
import { toast } from "react-toastify";

const UserList = () => {
  const { data: users, refetch, isLoading, error } = useGetUsersQuery();
  const [deleteUser] = useDeleteUserMutation();
  const [updateUser] = useUpdateUserMutation();

  const [editableUserId, setEditableUserId] = useState(null);
  const [editableUserName, setEditableUserName] = useState("");
  const [editableEmail, setEditableEmail] = useState("");
  const [editableIsAdmin, setEditableIsAdmin] = useState(false);

  useEffect(() => {
    refetch();
  }, [refetch]);

  // Calculate user statistics
  const totalUsers = users?.length || 0;
  const adminUsers = users?.filter((user) => user && user.isAdmin).length || 0;
  const regularUsers =
    users?.filter((user) => user && !user.isAdmin).length || 0;
  const verifiedUsers = users?.filter((user) => user && user.email).length || 0;

  const deleteHandler = async (id) => {
    if (
      window.confirm(
        "Are you sure you want to delete this user? This action cannot be undone."
      )
    ) {
      try {
        await deleteUser(id);
        toast.success("User deleted successfully");
        refetch();
      } catch (error) {
        toast.error(error?.data?.message || error.message);
      }
    }
  };

  const toggleEdit = (id, username, email, isAdmin) => {
    setEditableEmail(email);
    setEditableUserId(id);
    setEditableUserName(username);
    setEditableIsAdmin(isAdmin);
  };

  const updateHandler = async (id) => {
    try {
      await updateUser({
        userId: id,
        username: editableUserName,
        email: editableEmail,
        isAdmin: editableIsAdmin,
      });
      setEditableUserId(null);
      toast.success("User updated successfully");
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f0f10] to-[#1a1a1a] text-white">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f0f10] to-[#1a1a1a] text-white">
        <div className="container mx-auto px-4 py-8">
          <Message variant="danger">
            {error?.data?.message || error.error}
          </Message>
        </div>
      </div>
    );
  }

  if (!users || users.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f0f10] to-[#1a1a1a] text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-20">
            <div className="bg-gradient-to-br from-[#50C878] to-[#45a06a] rounded-full p-4 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
              <FaUsers className="text-3xl text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">
              No Users Found
            </h2>
            <p className="text-gray-400 mb-6">
              There are no users in the system yet.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f10] to-[#1a1a1a] text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <FaUsers className="text-[#50C878]" />
            User Management
          </h1>
          <p className="text-gray-400">
            Manage all registered users and their permissions
          </p>
        </div>

        {/* User Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-xl p-6 border border-gray-700 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">Total Users</p>
                <p className="text-2xl font-bold text-white">{totalUsers}</p>
              </div>
              <div className="bg-[#50C878]/20 p-3 rounded-lg">
                <FaUsers className="text-2xl text-[#50C878]" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-xl p-6 border border-gray-700 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">Admin Users</p>
                <p className="text-2xl font-bold text-purple-400">
                  {adminUsers}
                </p>
              </div>
              <div className="bg-purple-500/20 p-3 rounded-lg">
                <FaCrown className="text-2xl text-purple-500" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-xl p-6 border border-gray-700 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">
                  Regular Users
                </p>
                <p className="text-2xl font-bold text-blue-400">
                  {regularUsers}
                </p>
              </div>
              <div className="bg-blue-500/20 p-3 rounded-lg">
                <FaUser className="text-2xl text-blue-500" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-xl p-6 border border-gray-700 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">
                  Verified Users
                </p>
                <p className="text-2xl font-bold text-green-400">
                  {verifiedUsers}
                </p>
              </div>
              <div className="bg-green-500/20 p-3 rounded-lg">
                <FaUserShield className="text-2xl text-green-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Admin Menu and Users Table */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Admin Menu */}
          <div className="absolute">
            <AdminMenu />
          </div>

          {/* Users Table */}
          <div className="flex-1">
            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-2xl border border-gray-700 shadow-2xl overflow-hidden">
              <div className="p-6 border-b border-gray-700">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <FaUsers className="text-[#50C878]" />
                  All Users ({totalUsers})
                </h2>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#101011] border-b border-gray-700">
                    <tr>
                      <th className="px-6 py-4 text-left text-gray-300 font-semibold">
                        User ID
                      </th>
                      <th className="px-6 py-4 text-left text-gray-300 font-semibold">
                        Username
                      </th>
                      <th className="px-6 py-4 text-left text-gray-300 font-semibold">
                        Email
                      </th>
                      <th className="px-6 py-4 text-center text-gray-300 font-semibold">
                        Role
                      </th>
                      <th className="px-6 py-4 text-center text-gray-300 font-semibold">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {users.map((user) => (
                      <tr
                        key={user._id}
                        className="hover:bg-[#101011] transition-colors"
                      >
                        {/* User ID */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <FaUser className="text-gray-400" />
                            <span className="text-gray-300 font-mono text-sm">
                              {user._id ? user._id.slice(-8) : "N/A"}
                            </span>
                          </div>
                        </td>

                        {/* Username */}
                        <td className="px-6 py-4">
                          {editableUserId === user._id ? (
                            <input
                              type="text"
                              value={editableUserName}
                              onChange={(e) =>
                                setEditableUserName(e.target.value)
                              }
                              className="w-full p-3 border border-gray-600 rounded-lg bg-[#101011] text-white focus:ring-2 focus:ring-[#50C878] focus:border-[#50C878] transition-all duration-200"
                              placeholder="Enter username"
                            />
                          ) : (
                            <div className="flex items-center gap-2">
                              <FaUserEdit className="text-gray-400" />
                              <span className="text-white font-medium">
                                {user.username || "N/A"}
                              </span>
                            </div>
                          )}
                        </td>

                        {/* Email */}
                        <td className="px-6 py-4">
                          {editableUserId === user._id ? (
                            <input
                              type="email"
                              value={editableEmail}
                              onChange={(e) => setEditableEmail(e.target.value)}
                              className="w-full p-3 border border-gray-600 rounded-lg bg-[#101011] text-white focus:ring-2 focus:ring-[#50C878] focus:border-[#50C878] transition-all duration-200"
                              placeholder="Enter email"
                            />
                          ) : (
                            <div className="flex items-center gap-2">
                              <FaEnvelope className="text-gray-400" />
                              <a
                                href={`mailto:${user.email || "#"}`}
                                className="text-[#50C878] hover:text-[#45a06a] transition-colors"
                              >
                                {user.email || "N/A"}
                              </a>
                            </div>
                          )}
                        </td>

                        {/* Role */}
                        <td className="px-6 py-4 text-center">
                          {editableUserId === user._id ? (
                            <div className="flex items-center justify-center gap-2">
                              <input
                                type="checkbox"
                                checked={editableIsAdmin}
                                onChange={(e) =>
                                  setEditableIsAdmin(e.target.checked)
                                }
                                className="w-4 h-4 text-[#50C878] bg-[#101011] border-gray-600 rounded focus:ring-[#50C878] focus:ring-2"
                              />
                              <span className="text-gray-300 text-sm">
                                {editableIsAdmin ? "Admin" : "User"}
                              </span>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center">
                              {user.isAdmin ? (
                                <span className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm font-medium border border-purple-500/30">
                                  <FaCrown className="text-xs" />
                                  Admin
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm font-medium border border-blue-500/30">
                                  <FaUser className="text-xs" />
                                  User
                                </span>
                              )}
                            </div>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4 text-center">
                          {editableUserId === user._id ? (
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => updateHandler(user._id)}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
                                title="Save changes"
                              >
                                <FaCheck className="text-sm" />
                                Save
                              </button>
                              <button
                                onClick={() => setEditableUserId(null)}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
                                title="Cancel editing"
                              >
                                <FaTimes className="text-sm" />
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() =>
                                  toggleEdit(
                                    user._id,
                                    user.username,
                                    user.email,
                                    user.isAdmin
                                  )
                                }
                                className="inline-flex items-center gap-2 px-3 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors font-medium"
                                title="Edit user"
                              >
                                <FaEdit className="text-sm" />
                                Edit
                              </button>
                              {!user.isAdmin && (
                                <button
                                  onClick={() => deleteHandler(user._id)}
                                  className="inline-flex items-center gap-2 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
                                  title="Delete user"
                                >
                                  <FaTrash className="text-sm" />
                                  Delete
                                </button>
                              )}
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserList;
