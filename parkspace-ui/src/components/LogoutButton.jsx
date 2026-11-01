import { useState } from "react";

function LogoutButton() {
const [loading] = useState(false);

const handleLogout = async () => {
if (loading) return;
 

};

return ( <button
   type="button"
   onClick={handleLogout}
   disabled={loading}
 >
{loading ? "Logging out..." : "Logout"} </button>
);
}

export default LogoutButton;
