
import DirectoryExplorer from "../../components/DirectoryExplorer";

const TOURISM_ENDPOINTS = ["hotels", "restaurants"];

export default function TourismPage() {
  return (
    <DirectoryExplorer
      title="Tourisme au Maroc"
      description="Découvrez des hôtels, restaurants et destinations pour préparer votre prochaine visite."
      endpoints={TOURISM_ENDPOINTS}
    />
  );
}
