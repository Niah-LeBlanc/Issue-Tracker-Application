
function Home() {

  return (
    <>
      
			<div className="w-screen h-screen overflow-hidden relative before:block before:absolute before:bg-black before:h-full before:w-full before:top-0 before:left-0 before:z-10 before:opacity-30">
				<img src="/heroBackground.avif" className="absolute top-0 left-0 min-h-full ob" alt=""/>
				<div className="relative z-20 max-w-screen-lg mx-auto grid grid-cols-12 h-full items-center">
					<div className="col-span-6">
						<span className="uppercase text-white text-xs font-bold mb-2 block">WE FIX FAST</span>
						<h1 className="text-white font-extrabold text-5xl mb-8">Track, manage, and squash bugs with precision</h1>
						<p className="text-stone-100 text-base">
							Our bug tracking platform streamlines issue reporting, prioritization, and resolution—so your team stays focused and your product stays clean.
						</p>
						<button className="mt-8 text-white uppercase py-4 text-base font-light px-10 border border-white hover:bg-white hover:bg-opacity-10">Get started</button>
					</div>
				</div>
			</div>
			<div className="bg-[#f7d0b6] py-20">
				<div className="max-w-screen-lg mx-auto flex justify-between items-center">
					<div className="max-w-xl">
						<h2 className="font-black text-sky-950 text-3xl mb-4">As the leading experts in this field, we're in over 90 countries</h2>
						<p className="text-base text-sky-950">View Some of our partners below</p>
					</div>
					<button className="text-sky-950 uppercase py-3 text-base px-10 border border-sky-950 hover:bg-sky-950 hover:bg-opacity-10">Sign up your business with us!</button>
				</div>
			</div>
			<div className="py-12 relative overflow-hidden bg-white">
				<div className="grid grid-cols-2 max-w-screen-lg mx-auto">
					<div className="w-full flex flex-col items-end pr-16">
						<h2 className="text-[#64618C] font-bold text-2xl max-w-xs text-right mb-12 mt-10">Streamlining QA for fast-moving dev teams</h2>
						<div className="h-full mt-auto overflow-hidden relative">
							<img src="/devLabs.jpg" className="h-full w-full object-contain border-4 rounded-2xl" alt=""/>
						</div>
					</div>

					<div className="py-20 bg-slate-100 relative before:absolute before:h-full before:w-screen before:bg-sky-950 before:top-0 before:left-0">
						<div className="relative z-20 pl-12">
							<h2 className="text-[#f7d0b6] font-black text-5xl leading-snug mb-10"> DevLab Tools</h2>
							<p className="text-white text-sm">
								DevLab uses our bug tracking system to capture edge-case failures across multiple environments, helping their engineers resolve issues 40% faster during sprint cycles.
							</p>
							<button className="mt-8 text-white uppercase py-3 text-sm px-10 border border-white hover:bg-white hover:bg-opacity-10">View Their Website</button>
						</div>
					</div>
				</div>
			</div>

			<div className="py-4 relative overflow-hidden bg-white">
				<div className="grid grid-cols-2 max-w-screen-lg mx-auto">
					

					<div className="py-20 bg-slate-100 relative before:absolute before:h-full before:w-screen before:bg-[#f7d0b6] before:top-0 before:right-0">
						<div className="relative z-20 pl-12">
							<h2 className="text-sky-950 font-black text-5xl leading-snug mb-10"> PixelForge Studios</h2>
							<p className="text-sky-950 text-sm">
								This indie game studio relies on our platform to log player-reported bugs, prioritize fixes, and push clean updates—ensuring immersive experiences with minimal downtime.
							</p>
							<button className="mt-8 text-sky-950 uppercase py-3 text-sm px-10 border border-sky-950 hover:bg-white hover:bg-opacity-10">View Their Website</button>
						</div>
					</div>
					<div className="w-full flex flex-col pl-16">
						<h2 className="text-[#64618C] font-bold text-2xl max-w-xs text-left mb-12 mt-10">Keeping gameplay smooth and glitch-free</h2>
						<div className="h-full mt-auto overflow-hidden relative">
							<img src="/pixelForge.avif" className="h-full w-full object-contain border-4 rounded-2xl " alt=""/>
						</div>
					</div>

				</div>
			</div>

			<div className="py-12 relative overflow-hidden bg-white">
				<div className="grid grid-cols-2 max-w-screen-lg mx-auto">
					<div className="w-full flex flex-col items-end pr-16">
						<h2 className="text-[#64618C] font-bold text-2xl max-w-xs text-right mb-12 mt-10">E-commerce without the errors</h2>
						<div className="h-full mt-auto overflow-hidden relative">
							<img src="/shopfinity.jpg" className="h-full w-full object-contain border-4 rounded-2xl" alt=""/>
						</div>
					</div>

					<div className="py-20 bg-slate-100 relative before:absolute before:h-full before:w-screen before:bg-sky-950 before:top-0 before:left-0">
						<div className="relative z-20 pl-12">
							<h2 className="text-[#f7d0b6] font-black text-5xl leading-snug mb-10"> Shopfinity</h2>
							<p className="text-white text-sm">
								Shopfinity integrates our bug tracker to monitor frontend and backend issues in real time, reducing cart abandonment and improving customer trust across their global storefronts.
							</p>
							<button className="mt-8 text-white uppercase py-3 text-sm px-10 border border-white hover:bg-white hover:bg-opacity-10">View Their Website</button>
						</div>
					</div>
				</div>
			</div>
				
    </>
  )
}

export default Home
