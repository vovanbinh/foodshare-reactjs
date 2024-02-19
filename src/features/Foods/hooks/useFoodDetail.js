import { useEffect, useState } from "react";
import foodApi from "../../../Api/foodApi";

export default function useFoodDetail(foodSlug) {
  const [food, setFood] = useState({});
  const [loading, setLoading] = useState(true);
  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await foodApi.getDetail(foodSlug);
      setFood(result);
    } catch (error) {
      console.log('Failed to fetch product', error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, [foodSlug]);
  const refreshData = () => {
    fetchData();
  };
  return { food, loading, refreshData };
}
