import { useEffect, useState } from "react";

import useAdmin from "../../hooks/useAdmin";
import DisputeCard from "./disputeCard";




function AdminDispute() {
  const { getAllDisputes } = useAdmin();
  const [disputes, setDisputes] = useState([]);

  useEffect(() => {
    getAllDisputes().then((data) => {
      setDisputes(data);
    });
  }, [getAllDisputes]);

  return (
    <div>
      {disputes.sort((a, b) => b.timestamp - a.timestamp).map((item) => (
        <DisputeCard key={item.disputeId} item={item} />
      ))}
    </div>
  );
}

export default AdminDispute;
