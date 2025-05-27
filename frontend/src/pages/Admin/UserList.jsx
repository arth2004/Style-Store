import { useEffect, useState } from "react";
import {
  useDeleteUserMutation,
  useGetUsersQuery,
  useUpdateUserMutation,
} from "../../redux/api/usersApiSlice";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { FaCheck, FaEdit, FaTimes, FaTrash } from "react-icons/fa";
import AdminMenu from "./AdminMenu";

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

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure")) {
      try {
        await deleteUser(id);
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
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className="p-4  mt-10">
      <AdminMenu />
      <h1 className="text-4xl font-semibold mb-4 text-center">Users</h1>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <div className="flex flex-col overflow-x-auto">
          <table className="w-full border-collapse bg-white text-sm shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-700 text-white uppercase text-xs">
              <tr>
                <th className="px-4 py-2 text-left">ID</th>
                <th className="px-4 py-2 text-left">NAME</th>
                <th className="px-4 py-2 text-left">EMAIL</th>
                <th className="px-4 py-2 text-left">ADMIN</th>
                <th className="px-4 py-2 text-left">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr
                  key={user._id}
                  className={`border-b text-black text-l ${
                    index % 2 === 0 ? "bg-gray-200" : "bg-white "
                  } hover:bg-gray-400`}
                >
                  <td className="py-3 px-5 whitespace-nowrap">{user._id}</td>

                  <td className="py-3 px-5 whitespace-nowrap">
                    {editableUserId === user._id ? (
                      <input
                        type="text"
                        value={editableUserName}
                        onChange={(e) => setEditableUserName(e.target.value)}
                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-pink-400 outline-none"
                      />
                    ) : (
                      user.username
                    )}
                  </td>

                  <td className="py-3 px-5 whitespace-nowrap">
                    {editableUserId === user._id ? (
                      <input
                        type="text"
                        value={editableEmail}
                        onChange={(e) => setEditableEmail(e.target.value)}
                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-pink-400 outline-none"
                      />
                    ) : (
                      <a
                        href={`mailto:${user.email}`}
                        className="hover:underline"
                      >
                        {user.email}
                      </a>
                    )}
                  </td>

                  <td className="py-3 px-5 whitespace-nowrap">
                    {user.isAdmin ? (
                      <FaCheck className="text-green-500" />
                    ) : (
                      <FaTimes className="text-red-500" />
                    )}
                  </td>

                  <td className="py-3 px-5 whitespace-nowrap">
                    {editableUserId === user._id ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => updateHandler(user._id)}
                          className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-full transition"
                        >
                          <FaCheck />
                        </button>
                        <button
                          onClick={() => setEditableUserId(null)}
                          className="bg-gray-400 hover:bg-gray-500 text-white p-2 rounded-full transition"
                        >
                          <FaTimes />
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            toggleEdit(
                              user._id,
                              user.username,
                              user.email,
                              user.isAdmin
                            )
                          }
                          className="bg-yellow-400 hover:bg-yellow-500 text-white p-2 rounded-full transition"
                        >
                          <FaEdit />
                        </button>
                        {!user.isAdmin && (
                          <button
                            onClick={() => deleteHandler(user._id)}
                            className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition"
                          >
                            <FaTrash />
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
      )}
    </div>
  );
};

export default UserList;
