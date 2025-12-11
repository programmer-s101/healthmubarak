import Button from "@/components/ui/Button";

export default function UserQuickActions() {
  return (
    <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">

      <Button className="w-full py-3 text-center">
        Purchase Now
      </Button>

      <Button className="w-full py-3 bg-green-600 hover:bg-green-700">
        My Orders
      </Button>

      <Button className="w-full py-3 bg-purple-600 hover:bg-purple-700">
        Payment History
      </Button>

    </div>
  );
}
