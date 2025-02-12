import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";

const SummaryCard = ({ title, icon: Icon, value }) => {
  const iconColor =
    title === "Active Sites" ? "text-green-500" :
      title === "Inactive Sites" ? "text-red-500" :
        "text-primary"; // Default color

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2">
          <Icon className={`h-6 w-6 ${iconColor}`} />
          <span className="text-2xl font-bold">{value}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default SummaryCard;
