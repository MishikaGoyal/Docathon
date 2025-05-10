import Link from "next/link";
import React from "react";

function page() {
  return (
    <div>
      <div className="flex gap-6">
        <Link href="/doctor/dashboard">
          <button>Doctor</button>
        </Link>
        <Link href="/patient/dashboard">
          <button>Patient</button>
        </Link>
      </div>
    </div>
  );
}

export default page;
