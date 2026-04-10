import PurchasesDashboard from "../components-cisne/PurchasesDashboard";
import { getPurchasesViewModel } from "../components-cisne/purchasesData";

export default function ComprasPage() {
  const data = getPurchasesViewModel();

  return <PurchasesDashboard data={data} />;
}
