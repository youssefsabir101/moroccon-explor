
import DirectoryExplorer from "../../components/DirectoryExplorer";

const TOURISM_ENDPOINTS = [
  "hotels",
  "restaurants",
  "cafes",
  "tourist-attractions",
  "museums",
  "parks",
];

export default function TourismPage() {
  return (
    <DirectoryExplorer
      title="Tourisme au Maroc"
      description="Découvrez les hôtels, restaurants, cafés, monuments, musées et espaces verts du Maroc."
      endpoints={TOURISM_ENDPOINTS}
    />
  );
}
