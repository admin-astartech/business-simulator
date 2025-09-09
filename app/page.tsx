export default function Home() {
  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Hello world
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Welcome to your Next.js app with Tailwind CSS and a beautiful sidebar!
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Dashboard</h3>
            <p className="text-gray-600">View your business metrics and key performance indicators.</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Analytics</h3>
            <p className="text-gray-600">Analyze your data with powerful charts and insights.</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Products</h3>
            <p className="text-gray-600">Manage your product catalog and inventory.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
