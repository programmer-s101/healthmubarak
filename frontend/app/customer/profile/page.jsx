"use client";

export default function Profile() {
  const name = "User";
  const phone = localStorage.getItem("user_id");

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Profile</h1>
      <p>User ID: {phone}</p>
    </div>
  );
}
