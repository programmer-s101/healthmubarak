"use client";

export default function AuthLanding({ children }) {
  return (
    <div className="min-h-screen bg-[#f6f8f3]">
      {/* Top bar */}
      <header className="px-10 py-6">
        <h1 className="text-2xl font-bold text-green-800">
          HealthMubarak
        </h1>
      </header>

      {/* Main landing */}
      <main className="grid grid-cols-1 lg:grid-cols-2 items-center gap-12 px-10 max-w-7xl mx-auto">
        
        {/* LEFT — BRAND / HERO */}
        <section>
          <h2 className="text-5xl font-bold leading-tight text-gray-900">
            Organic & Healthy  
            <span className="block text-green-700">
              Living Starts Here
            </span>
          </h2>

          <p className="mt-6 text-lg text-gray-600 max-w-md">
            Discover pure, natural, and organic products curated
            for a healthier lifestyle.
          </p>

          {/* Visual */}
          <div className="mt-10">
            <img
              src="/landing-products.png"
              alt="Organic products"
              className="w-full max-w-md"
            />
          </div>
        </section>

        {/* RIGHT — AUTH */}
        <section className="bg-white rounded-3xl shadow-xl p-10 max-w-md w-full justify-self-center">
          {children}
        </section>

      </main>
    </div>
  );
}
