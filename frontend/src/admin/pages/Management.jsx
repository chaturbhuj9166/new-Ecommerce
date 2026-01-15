import { useEffect, useState } from "react";
import instance from "../../axiosConfig";
import { AiOutlineDelete } from "react-icons/ai";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Management = () => {
  const [admins, setAdmins] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  /* ================= FETCH USERS ================= */
  const fetchAllUsers = async () => {
    try {
      const res = await instance.get("/user", {
        withCredentials: true,
      });

      const adminList = res.data.filter((u) => u.role === "admin");
      const userList = res.data.filter((u) => u.role === "user");

      setAdmins(adminList);
      setUsers(userList);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  /* ================= DELETE USER ================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this account permanently?")) return;

    try {
      await instance.delete(`/user/delete/${id}`, {
        withCredentials: true,
      });

      toast.success("User deleted successfully");
      fetchAllUsers();
    } catch (error) {
      console.error(error);
      toast.error("Delete failed");
    }
  };

  /* ================= BLOCK / UNBLOCK ================= */
  const handleBlockToggle = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to change block status?"
      )
    )
      return;

    try {
      const res = await instance.patch(
        `/admin/block-user/${id}`,
        {},
        { withCredentials: true }
      );

      toast.success(res.data.message);
      fetchAllUsers();
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message ||
          "Block action failed"
      );
    }
  };

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <p className="text-lg font-medium">
          Loading users...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-12">
      <button
        onClick={() => navigate("/admin/dashboard")}
        className="px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition text-sm"
      >
        ← Back to Dashboard
      </button>

      <h1 className="text-2xl font-bold">
        User & Admin Management
      </h1>

      {/* ================= ADMINS ================= */}
      <div>
        <h2 className="text-xl font-semibold mb-4">
          Admin Accounts
        </h2>

        <div className="overflow-x-auto bg-white shadow rounded-xl">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Username</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {admins.map((admin) => (
                <tr
                  key={admin._id}
                  className="border-t hover:bg-gray-50"
                >
                  <td className="p-3">{admin.name}</td>
                  <td className="p-3">{admin.email}</td>
                  <td className="p-3">{admin.username}</td>
                  <td className="p-3 flex justify-center gap-3">
                    <button
                      onClick={() =>
                        handleDelete(admin._id)
                      }
                      className="text-red-600 hover:text-red-800"
                    >
                      <AiOutlineDelete />
                    </button>

                    <button
                      onClick={() =>
                        handleBlockToggle(admin._id)
                      }
                      className={`px-3 py-1 rounded text-white text-sm ${
                        admin.isBlocked
                          ? "bg-green-600 hover:bg-green-700"
                          : "bg-red-600 hover:bg-red-700"
                      }`}
                    >
                      {admin.isBlocked
                        ? "Unblock"
                        : "Block"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {!admins.length && (
            <p className="p-4 text-center text-gray-500">
              No admins found
            </p>
          )}
        </div>
      </div>

      {/* ================= USERS ================= */}
      <div>
        <h2 className="text-xl font-semibold mb-4">
          Users
        </h2>

        <div className="overflow-x-auto bg-white shadow rounded-xl">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Username</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr
                  key={user._id}
                  className="border-t hover:bg-gray-50"
                >
                  <td className="p-3">{user.name}</td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3">{user.username}</td>
                  <td className="p-3 flex justify-center gap-3">
                    <button
                      onClick={() =>
                        handleDelete(user._id)
                      }
                      className="text-red-600 hover:text-red-800"
                    >
                      <AiOutlineDelete />
                    </button>

                    <button
                      onClick={() =>
                        handleBlockToggle(user._id)
                      }
                      className={`px-3 py-1 rounded text-white text-sm ${
                        user.isBlocked
                          ? "bg-green-600 hover:bg-green-700"
                          : "bg-red-600 hover:bg-red-700"
                      }`}
                    >
                      {user.isBlocked
                        ? "Unblock"
                        : "Block"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {!users.length && (
            <p className="p-4 text-center text-gray-500">
              No users found
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Management;
