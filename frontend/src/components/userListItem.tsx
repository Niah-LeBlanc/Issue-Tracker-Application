import { Link } from 'react-router-dom';


function UserListItem({user}: any ) {
	//pass user through the function
	const currentUser = user;
  return (
    <>
			<a href="#" className="relative inline-block duration-300 ease-in-out transition-transform transform hover:-translate-y-2 w-full">
				<div className="shadow p-4 rounded-lg bg-white">
				<div className="mt-4">
					<h2 className="font-medium text-base md:text-lg text-gray-800 line-clamp-1" title="New York">
					{user.name}
					</h2>
					<p className="mt-2 text-sm text-gray-800 line-clamp-1" title="New York, NY 10004, United States">
					{user.email}
					</p>
					<p className="mt-2 text-sm text-gray-800 line-clamp-1" title="New York, NY 10004, United States">
						<i className="fas fa-map-marker-alt mr-2 text-lg text-gray-50">{user.role?.join(', ')}</i>
					</p>
				</div>

				<div className="grid grid-cols-2 grid-rows-2 gap-4 mt-8">
					<p className="inline-flex flex-col xl:flex-row xl:items-center text-gray-800">
					<span className="mt-2 xl:mt-0">
						created Bugs: {user.createdBugs ? user.createdBugs.length : 0}
					</span>
					</p>
					<p className="inline-flex flex-col xl:flex-row xl:items-center text-gray-800">
					<span className="mt-2 xl:mt-0">
						assigned Bugs: {user.assignedBugs ? user.assignedBugs.length : 0}
					</span>
					</p>
					<p className="inline-flex flex-col xl:flex-row xl:items-center text-gray-800">
						<span className="mt-2 xl:mt-0">
						<p className='text-white'>
							{Array.isArray(user.createdBugs) && user.createdBugs.length > 0 ? (
								user.createdBugs.map((bug: any, idx: number) => (
									<div key={bug._id || idx} className="mb-2 text-white">
										<p className="font-semibold text-blue-200">{bug.title}</p>
										<p className="italic">{bug.status}</p>
									</div>
								))
							) : (
								<p className="text-gray-400">No bugs Created.</p>
							)}
						</p>
					</span>
					</p>
					<p className="inline-flex flex-col xl:flex-row xl:items-center text-gray-800">
					<span className="mt-2 xl:mt-0">
						<p className='text-white'>
							{Array.isArray(user.assignedBugs) && user.assignedBugs.length > 0 ? (
								user.assignedBugs.map((bug: any, idx: number) => (
									<div key={bug._id || idx} className="mb-2 text-white">
										<p className="font-semibold text-blue-200">{bug.title}</p>
										<p className="italic">{bug.status}</p>
									</div>
								))
							) : (
								<p className="text-gray-400">No bugs assigned.</p>
							)}
						</p>
					</span>
					</p>
				</div>

				<div className="grid grid-cols-2 mt-8">
					<div className="flex items-center">
					<div className='mt-4 hover:-translate-y-1 ease-in-out transition'>
						<Link to='/UserEditor' state={{user: currentUser}}><span className="justify-center text-white border-gray-50/50 border-3 w-10/12 mt-5  bg-purple-600/30 p-2 rounded-2xl transition hover:bg-purple-400/50 ">Edit User</span></Link>
					</div>
					</div>
				</div>
				</div>
			</a>				
    </>
  )
}

export default UserListItem
