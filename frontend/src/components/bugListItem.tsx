import { Link } from 'react-router-dom';
// import { Trash2 } from 'lucide-react';
// import axios from 'axios';

function BugListItem({ bug }: any ) {
  const currentBug = bug;
	
	const fixedStatus = bug.closed ? 'Closed' : 'Open';

  return (
    <>
		<div className="w-full px-4 mx-auto col-span-1">
					<div className="relative flex flex-col min-w-0 break-words bg-gray-300 w-full mb-6 shadow-xl rounded-lg mt-16 p-3">
				<a href="#" className="relative inline-block duration-300 ease-in-out transition-transform transform hover:-translate-y-2 w-full">
				<div className="shadow p-2 rounded-lg bg-white gap-3">
				<div className="mt-4">
					<h2 className="font-medium text-base md:text-lg text-gray-800 line-clamp-1" >
						{bug.title}
					</h2>
					<p className="mt-2 text-sm text-gray-800 line-clamp-1" >
					{bug.createdBy}
					</p>
					<p className="mt-2 text-sm text-gray-800 line-clamp-1">
					{bug.description}
					</p>
					<p className="mt-2 text-sm text-gray-800 line-clamp-1">
					{bug.stepsToReproduce}
					</p>
					<p className="mt-2 text-sm text-gray-800 line-clamp-1" >
					{bug.classification}
					</p>
					<p className="mt-2 text-sm text-gray-800 line-clamp-1">
					{new Date(bug.createdOn).toLocaleString()}
					</p>
				</div>

				<div className="grid grid-cols-2 grid-rows-2 gap-4 mt-8 pl-2">
					<p className="inline-flex flex-col xl:flex-row xl:items-center text-gray-800">
					<span className="mt-2 xl:mt-0">
						Comments: {bug.comments ? bug.comments.length : 0}
					</span>
					</p>
					<p className="inline-flex flex-col xl:flex-row xl:items-center text-gray-800">
					<span className="mt-2 xl:mt-0">
						Total Testcases: {bug.testcase ? bug.testcase.length : 0}
					</span>
					</p>
					<p className="inline-flex flex-col xl:flex-row xl:items-center text-gray-800">
					<span className="mt-2 xl:mt-0">
						Total Worked Hours: {bug.workLog ? bug.workLog.reduce((sum: number, log: { time: string }) => sum + Number(log.time), 0) : 0}
					</span>
					</p>
					<p className="inline-flex flex-col xl:flex-row xl:items-center text-gray-800">
					<span className="mt-2 xl:mt-0">
						{fixedStatus}	
					</span>
					</p>
					
				</div>

				<div className=" mt-8">
					<div className="flex items-center">
						<p>Assigned to: {bug.assignedToUserEmail ? bug.assignedToUserEmail : "No User Assigned"}</p>
					<div className='mt-4 hover:-translate-y-1 ease-in-out transition pb-3 pl-2'>
						<Link to='/BugEditor' state={{bug: currentBug}} ><span className="justify-center text-white border-gray-50/50 border-3 w-10/12 mt-5  bg-purple-600/30 p-2 rounded-2xl transition hover:bg-purple-400/50 ">Edit Bug</span></Link>
					</div>
					</div>
				</div>
				</div>
			</a>	
			</div>
			</div>
    </>
  )
}

export default BugListItem
