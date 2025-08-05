import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Star, Loader2 } from "lucide-react";
import ConfirmModal from "../components/ConfirmModal";

const StoreList = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ratingInProgress, setRatingInProgress] = useState(null);
  const [userRatings, setUserRatings] = useState({});
  const [modalData, setModalData] = useState({ isOpen: false, storeId: null, newRating: null });
  const token = localStorage.getItem("token");

  const fetchStores = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/store", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load stores");
      setStores(data);

      const updatedRatings = {};
      data.forEach((store) => {
        const id = store.store_id ?? store.id ?? store._id;
        updatedRatings[id] = store.userRating || 0;
      });
      setUserRatings(updatedRatings);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  const submitRating = async () => {
    const { storeId, newRating } = modalData;
    setRatingInProgress(storeId);
    setModalData({ isOpen: false, storeId: null, newRating: null });

    try {
      const res = await fetch("http://localhost:5000/api/rate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          store_id: storeId,
          rating: newRating,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to rate");

      toast.success("Rating submitted!");
      setUserRatings((prev) => ({ ...prev, [storeId]: newRating }));
      fetchStores();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setRatingInProgress(null);
    }
  };

  const handleStarClick = (storeId, storeName, newRating) => {
    if (userRatings[storeId] && userRatings[storeId] !== newRating) {
      setModalData({ isOpen: true, storeId, newRating, storeName });
    } else {
      setModalData({ isOpen: false, storeId: null, newRating: null });
      submitRatingDirect(storeId, newRating);
    }
  };

  const submitRatingDirect = async (storeId, rating) => {
    setRatingInProgress(storeId);
    try {
      const res = await fetch("http://localhost:5000/api/rate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          store_id: storeId,
          rating: rating,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to rate");

      toast.success("Rating submitted!");
      setUserRatings((prev) => ({ ...prev, [storeId]: rating }));
      fetchStores();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setRatingInProgress(null);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading stores...</p>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-6">Store Listings</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {stores.map((store) => {
          const storeId = store.store_id ?? store.id ?? store._id;
          const userRating = userRatings[storeId] || 0;

          return (
            <div
              key={storeId}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition"
            >
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">{store.name}</h2>
              <p className="text-gray-600 dark:text-gray-300">{store.address}</p>

              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Overall Rating:</span>
                  <Star size={18} className="text-yellow-400" />
                  <span>{store.averageRating?.toFixed(1) || "N/A"}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-medium">Your Rating:</span>
                  {[...Array(5)].map((_, i) => {
                    const starValue = i + 1;
                    return (
                      <span
                        key={`star-${storeId}-${i}`}
                        onClick={() => handleStarClick(storeId, store.name, starValue)}
                        className="cursor-pointer"
                      >
                        {ratingInProgress === storeId ? (
                          <Loader2 size={18} className="animate-spin text-blue-500" />
                        ) : (
                          <Star
                            size={18}
                            className={`transition ${
                              starValue <= userRating ? "text-blue-500" : "text-gray-400"
                            }`}
                          />
                        )}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <ConfirmModal
        isOpen={modalData.isOpen}
        storeName={modalData.storeName}
        newRating={modalData.newRating}
        onClose={() =>
          setModalData({ isOpen: false, storeId: null, newRating: null })
        }
        onConfirm={submitRating}
      />
    </div>
  );
};

export default StoreList;
