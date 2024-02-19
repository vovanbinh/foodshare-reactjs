import { useEffect, useState } from "react";
import foodApi from "../../../Api/foodApi";

export default function useFoodDetail(foodId) {
  const [food, setFood] = useState({});
  const [loading, setLoading] = useState(true);
  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await foodApi.getDetailDonated(foodId);
      setFood(result);
    } catch (error) {
      console.log('Failed to fetch product', error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, [foodId]);
  const refreshData = () => {
    fetchData();
  };
  return { food, loading, refreshData };
}
