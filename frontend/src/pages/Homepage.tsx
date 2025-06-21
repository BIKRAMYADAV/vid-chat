function Homepage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 space-y-4">
      <input
        type="email"
        placeholder="Enter email"
        className="w-64 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        type="text"
        placeholder="Enter room code"
        className="w-64 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button className="w-64 px-4 py-2 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 transition duration-200">
        Enter Room
      </button>
    </div>
  );
}

export default Homepage;
