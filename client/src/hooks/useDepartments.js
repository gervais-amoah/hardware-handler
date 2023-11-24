import { useEffect, useState } from "react";
import { getAllDepartments } from "../services/departmentApi";
import { FETCH_DEPARTMENT_DATA_ERROR } from "../constants/constants";

function useDepartments() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchAllDepartments() {
      try {
        const response = await getAllDepartments();

        if (response !== FETCH_DEPARTMENT_DATA_ERROR) {
          setDepartments(response);
        } else {
          setError(response);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchAllDepartments();
  }, []);

  return [departments, [loading, error]];
}

export { useDepartments };
