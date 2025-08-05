import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Star } from "lucide-react";

const StoreList = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ratingInProgress, setRatingInProgress] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortByTopRated, setSortByTopRated] = useState(false);
  const token = localStorage.getItem("token");

  const fetchStores = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/store", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load stores");

     const transformed = data.map((s) => ({
  id: s.store_id,
  name: s.name,
  address: s.address || "Address not provided", // Optional fallback
  averageRating: s.averagerating,
  userRating: s.userrating,
}));

      setStores(transformed);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);



const handleRating = async (storeId, starValue) => {
  if (ratingInProgress === storeId) return;
  setRatingInProgress(storeId);

  const store = stores.find((s) => s.id === storeId);
  const wasAlreadyRated = store?.userRating > 0;

  try {
    const res = await fetch("http://localhost:5000/api/rate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        store_id: storeId,
        rating: starValue,
      }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to rate");

    toast.success(wasAlreadyRated ? "Rating updated!" : "Rating submitted!");

    // ✅ Refresh to get updated averageRating
    await fetchStores();
  } catch (err) {
    toast.error(err.message);
  } finally {
    setRatingInProgress(null);
  }
};


  const filteredAndSortedStores = stores
    .filter((store) =>
      `${store.name} ${store.address}`.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) =>
      sortByTopRated
        ? (b.averageRating || 0) - (a.averageRating || 0)
        : 0
    );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-6">Store Listings</h1>

      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <input
          type="text"
          placeholder="Search by name or address"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-1/2 p-2 border border-gray-300 rounded-md"
        />
        <select
          value={sortByTopRated ? "top" : "all"}
          onChange={(e) => setSortByTopRated(e.target.value === "top")}
          className="p-2 border border-gray-300 rounded-md"
        >
          <option value="all">All Stores</option>
          <option value="top">Top Rated</option>
        </select>
      </div>

     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  {filteredAndSortedStores.map((store) => {
    const { id, name, address, averageRating, userRating } = store;
    const isSubmitting = ratingInProgress === id;

    return (
      <div
        key={id}
        className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-md p-6 transition hover:shadow-xl"
      >
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">
          {name}
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{address || "No address provided"}</p>

        <div className="space-y-3">
          {/* Overall Rating */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Overall Rating:</span>
            <Star size={18} className="text-yellow-400 fill-yellow-400" />
            <span className="text-sm text-gray-800 dark:text-white">
              {averageRating && !isNaN(averageRating)
                ? Number(averageRating).toFixed(1)
                : "N/A"}
            </span>
          </div>

          {/* User Rating */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Your Rating:</span>
            {[...Array(5)].map((_, i) => {
              const starValue = i + 1;
              const filled = starValue <= userRating;

              return (
                <Star
                  key={`star-${id}-${i}`}
                  size={20}
                  onClick={() => handleRating(id, starValue)}
                  className={`cursor-pointer transition ${
                    filled ? "fill-yellow-400 text-yellow-400" : "fill-none text-gray-400"
                  } ${isSubmitting ? "pointer-events-none opacity-50" : ""}`}
                />
              );
            })}
          </div>
        </div>
      </div>
    );
  })}
</div>

    </div>
  );
};

export default StoreList;
