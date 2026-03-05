import { useState, useEffect } from 'react';
import UserListItem from './userListItem';
import api from '../api';
import { Search } from 'lucide-react';

function UserList() {
  const [users, setUsers] = useState<any[]>([]);
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState('');
  const [searchedRole, setSearchedRole] = useState("");
  const [minAge, setMinAge] = useState("");
  const [maxAge, setMaxAge] = useState("");
  const [sortBy, setSortBy] = useState("Given Name");

  const sortByOptions = ["Given Name", "Family Name", "Role", "Newest", "Oldest"];

  const roles = [
    { value: 'developer', label: 'Developer' },
    { value: 'business analyst', label: 'Business Analyst' },
    { value: 'quality analyst', label: 'Quality Analyst' },
    { value: 'product manager', label: 'Product Manager' },
    { value: 'technical manager', label: 'Technical Manager' },
    { value: 'admin', label: 'Admin' }
  ];

  const clearFilters = () => {
    setMinAge("");
    setMaxAge("");
    setSearchedRole("");
    setSearchValue("");
  };

  const SearchWithParams = async () => {
    setIsPending(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (searchValue) params.append("keywords", searchValue);
      if (searchedRole && searchedRole !== "Any") params.append("role", searchedRole);
      if (minAge) params.append("minAge", minAge);
      if (maxAge) params.append("maxAge", maxAge);
      if (sortBy === "Newest") params.append("sortBy", "newest");
      else if (sortBy === "Oldest") params.append("sortBy", "oldest");
      else if (sortBy === "Given Name") params.append("sortBy", "givenName");
      else if (sortBy === "Family Name") params.append("sortBy", "familyName");
      else if (sortBy === "Role") params.append("sortBy", "role");

      const response = await api.get(`/api/users?${params.toString()}`);
      setUsers(response.data);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError('Failed to fetch users');
    } finally {
      setIsPending(false);
    }
  };

  useEffect(() => {
    SearchWithParams();
  }, []);

  useEffect(() => {
    SearchWithParams();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchedRole, sortBy]);

  if (isPending) return <div className="text-center mt-10 text-xl">Loading users...</div>;
  if (error) return <div className="text-center mt-10 text-red-600">Error loading users: {error}</div>;

  return (
    <section className="flex flex-col text-center pt-16 bg-blue-300 min-h-screen border-2 border-black">
      <h1 className="text-7xl text-gray-800 font-black pb-6">All Users</h1>
      <div className="filter-container">
        <div className="flex flex-col items-center">
          <h2 className="text-gray-800 font-medium pb-2">Role:</h2>
          <select value={searchedRole} onChange={(e) => setSearchedRole(e.target.value)} className="border border-gray-300 rounded-full text-gray-600 h-10 pl-5 pr-10 bg-white hover:border-gray-400 focus:outline-none appearance-none">
            <option value="">Any Role</option>
            {roles.map((role) => (
              <option key={role.label} value={role.value}>{role.label}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col items-center">
          <h2 className="text-gray-800 font-medium pb-2">Sort By:</h2>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="border border-gray-300 rounded-full text-gray-600 h-10 pl-5 pr-10 bg-white hover:border-gray-400 focus:outline-none appearance-none">
            {sortByOptions.map((option) => <option key={option} value={option}>{option}</option>)}
          </select>
        </div>
        <div className="flex flex-col items-center">
          <h2 className="text-gray-800 font-medium pb-2">Min Age (days):</h2>
          <input type="text" placeholder="Min age in days" value={minAge} onChange={(e) => setMinAge(e.target.value)} className="bg-white h-10 px-5 pr-10 rounded-full text-sm focus:outline-none" />
        </div>
        <div className="flex flex-col items-center">
          <h2 className="text-gray-800 font-medium pb-2">Max Age (days):</h2>
          <input type="text" placeholder="Max age in days" value={maxAge} onChange={(e) => setMaxAge(e.target.value)} className="bg-white h-10 px-5 pr-10 rounded-full text-sm focus:outline-none" />
        </div>
        <div className="flex flex-col items-center">
          <h2 className="text-gray-800 font-medium pb-2">Reset:</h2>
          <button onClick={clearFilters} className="bg-white h-10 px-5 rounded-full text-sm focus:outline-none hover:bg-gray-100 font-medium">Clear Filters</button>
        </div>
        <div className="flex flex-col items-center">
          <h2 className="text-gray-800 font-medium pb-2">Search:</h2>
          <div className="relative flex items-center">
            <input type="search" name="search" placeholder="Search" value={searchValue} onChange={(e) => setSearchValue(e.target.value)} onKeyDown={(e) => e.key === "Enter" && SearchWithParams()} className="bg-white h-10 px-5 pr-12 rounded-full text-sm focus:outline-none w-40" />
            <button onClick={SearchWithParams} type="button" className="absolute right-3">
              <Search className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 px-4 pb-16">
        {users.map((user) => (
          <UserListItem key={user.email} user={user} />
        ))}
      </section>
    </section>
  );
}

export default UserList;
