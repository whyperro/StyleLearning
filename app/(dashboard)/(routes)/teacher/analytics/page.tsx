import { getAnalytics } from "@/actions/getAnalaytics";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import DataCard from "./_components/DataCard";
import { Chart } from "./_components/Chart";

const AnalyticsPage = async () => {
  const { userId } = auth();

  if (!userId) {
    redirect("/");
  }

  const { data, totalRevenue, totalSales } = await getAnalytics(userId);

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <DataCard
          shouldFormat={true}
          label="Ingresos Totales"
          value={totalRevenue}
        />
        <DataCard label="Ventas Totales" value={totalSales} />
      </div>
      <Chart data={data} />
    </div>
  );
};

export default AnalyticsPage;
