import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getAllDepartments } from "@/services/patientApi";
import { useNavigate} from "react-router-dom";
import DepartmentCard from "../components/custom/DepartmentCard";

function DepartmentList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { departments, loading, error } = useSelector((state) => state.patient);

  useEffect(() => {
    dispatch(getAllDepartments());
  }, [dispatch]);

  if (loading) return <p>Loading departments...</p>; 
  if (error) return <p>{error}</p>;

  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
      {departments.map((dept) => (
        <DepartmentCard
          key={dept._id}
          name={dept.deptname}
          description={dept.description}
          onClick={() =>
            navigate(`/departments/${dept.deptname}/doctors`)
          }
        />
      ))}
    </div>
  );
}

export default DepartmentList;

