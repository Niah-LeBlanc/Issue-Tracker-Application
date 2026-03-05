/* eslint-disable react-hooks/exhaustive-deps */
import BugListItem from './bugListItem';
import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import api from '../api';
import AddBugModal from './addBugModal';

interface Bug {
  _id: string;
  classification: string;
  closed: boolean;
  [key: string]: any;
}

function BugList() {
  const [bugs, setBugs] = useState<Bug[]>([]);
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [searchValue, setSearchValue] = useState('');
  const [selected, setSelected] = useState("View all");
  const [searchedClassification, setSearchedClassification] = useState("");
  const [minAge, setMinAge] = useState("");
  const [maxAge, setMaxAge] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const buttons = ["View all", "Closed", "Open"];
  const classifications = [...new Set(bugs.map(b => b.classification))];
  const sortByOptions = ["Newest", "Oldest", "Title", "Classification", "Assigned To", "Reported By"];

  const clearFilters = () => {
    setMinAge("");
    setMaxAge("");
    setSearchedClassification("");
    setSearchValue("");
    setSelected("View all");
  };

  const fetchBugs = async () => {
    const response = await api.get('/api/bugs');
    return response.data;
  };

  useEffect(() => {
    fetchBugs()
      .then(data => setBugs(data))
      .catch(err => setError(err))
      .finally(() => setIsPending(false));
  }, []);

  const SearchWithParams = async () => {
    setIsPending(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (selected === "Closed") params.append("closed", "true");
      else if (selected === "Open") params.append("closed", "false");
      if (searchValue) params.append("keywords", searchValue);
      if (searchedClassification && searchedClassification !== "Classification") params.append("classification", searchedClassification);
      if (minAge) params.append("minAge", minAge);
      if (maxAge) params.append("maxAge", maxAge);
      if (sortBy === "Newest") params.append("sortBy", "newest");
      else if (sortBy === "Oldest") params.append("sortBy", "oldest");
      else if (sortBy === "Title") params.append("sortBy", "title");
      else if (sortBy === "Classification") params.append("sortBy", "classification");
      else if (sortBy === "Assigned To") params.append("sortBy", "assignedTo");
      else if (sortBy === "Reported By") params.append("sortBy", "createdBy");

      const response = await api.get(`/api/bugs?${params.toString()}`);
      setBugs(response.data);
    } catch (err) {
      console.error("Error fetching bugs:", err);
    } finally {
      setIsPending(false);
    }
  };

  useEffect(() => {
    setSearchedClassification("");
    SearchWithParams();
  }, [selected]);

  useEffect(() => {
    SearchWithParams();
  }, [searchedClassification, sortBy]);

  if (isPending) return <div>Loading bugs...</div>;
  if (error) return <div>Error loading bugs: {error.message}</div>;

  return (
    <>
      <section className="flex flex-col text-center align-middle pt-16 bg-blue-300 overflow-auto min-h-screen border-2 border-black">
        <h1 className="text-7xl text-gray-800 font-black pb-6">All Bugs</h1>
        <button className='bg-red-500 p-2 w-2/12 rounded-2xl self-center mb-2' onClick={() => setIsModalOpen(true)}>Report Bug</button>
        <div className="filter-container">
          <div className="flex flex-col items-center">
            <h2 className="text-gray-800 font-medium pb-2">Options:</h2>
            <div className="inline-flex overflow-hidden bg-white border divide-x rounded-lg dark:bg-gray-900 rtl:flex-row-reverse dark:border-gray-700 dark:divide-gray-700">
              {buttons.map((label) => (
                <button key={label} onClick={() => setSelected(label)} className={`px-5 py-2 text-xs font-medium transition-colors duration-200 sm:text-sm ${selected === label ? "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100" : "bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"}`}>
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-col items-center">
            <h2 className="text-gray-800 font-medium pb-2">Classification:</h2>
            <select value={searchedClassification} onChange={(e) => setSearchedClassification(e.target.value)} className="border border-gray-300 rounded-full text-gray-600 h-10 pl-5 pr-10 bg-white hover:border-gray-400 focus:outline-none appearance-none">
              <option value="">Classification</option>
              {classifications.map((c) => <option key={c} value={c}>{c}</option>)}
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
              <input type="search" name="search" placeholder="Search" value={searchValue} onChange={(e) => setSearchValue(e.target.value)} className="bg-white h-10 px-5 pr-12 rounded-full text-sm focus:outline-none w-40" />
              <button onClick={SearchWithParams} onKeyDown={(e) => e.key === "Enter" && SearchWithParams()} type="button" className="absolute right-3">
                <Search className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
        <section className="grid grid-cols-1 lg:grid-cols-3 pt-16 bg-blue-300 overflow-auto min-h-screen border-2 border-black">
          {bugs.map((bug: any) => (
            <BugListItem key={bug._id} bug={bug} />
          ))}
        </section>
      </section>
      {isModalOpen && <AddBugModal onClose={() => setIsModalOpen(false)} />}
    </>
  )
}

export default BugList
